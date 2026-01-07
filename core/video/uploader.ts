/**
 * Upload Queue Service
 * 
 * Manages background uploads to Firebase Storage with:
 * - Offline queue (persisted to AsyncStorage)
 * - Automatic retry on failure
 * - WiFi-preferred uploads
 * - Progress tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../services/firebase';

const QUEUE_KEY = '@c100_upload_queue';
const MAX_RETRIES = 3;

export interface QueuedUpload {
    id: string;
    localUri: string;
    metadata: {
        userId: string;
        sessionId: string;
        distance: number;
        result: 'make' | 'miss';
    };
    retryCount: number;
    createdAt: number;
    status: 'pending' | 'uploading' | 'failed' | 'complete';
}

interface UploadProgress {
    id: string;
    progress: number; // 0-1
    status: QueuedUpload['status'];
}

type ProgressCallback = (progress: UploadProgress) => void;

class UploadQueue {
    private queue: QueuedUpload[] = [];
    private isProcessing = false;
    private progressCallbacks: Map<string, ProgressCallback> = new Map();

    async initialize() {
        try {
            const stored = await AsyncStorage.getItem(QUEUE_KEY);
            if (stored) {
                this.queue = JSON.parse(stored);
                // Reset any 'uploading' items to 'pending' (app may have crashed)
                this.queue = this.queue.map(item =>
                    item.status === 'uploading' ? { ...item, status: 'pending' as const } : item
                );
                await this.persistQueue();
            }
        } catch (error) {
            console.error('Failed to load upload queue:', error);
        }
    }

    async addToQueue(localUri: string, metadata: QueuedUpload['metadata']): Promise<string> {
        const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const item: QueuedUpload = {
            id,
            localUri,
            metadata,
            retryCount: 0,
            createdAt: Date.now(),
            status: 'pending',
        };

        this.queue.push(item);
        await this.persistQueue();

        // Try to process immediately
        this.processQueue();

        return id;
    }

    onProgress(id: string, callback: ProgressCallback) {
        this.progressCallbacks.set(id, callback);
        return () => this.progressCallbacks.delete(id);
    }

    private async persistQueue() {
        try {
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
        } catch (error) {
            console.error('Failed to persist queue:', error);
        }
    }

    private notifyProgress(id: string, progress: number, status: QueuedUpload['status']) {
        const callback = this.progressCallbacks.get(id);
        if (callback) {
            callback({ id, progress, status });
        }
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            // Check network
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                console.log('No network, skipping upload processing');
                return;
            }

            // Prefer WiFi for video uploads
            const isWifi = netState.type === 'wifi';

            // Get pending items
            const pending = this.queue.filter(item =>
                item.status === 'pending' ||
                (item.status === 'failed' && item.retryCount < MAX_RETRIES)
            );

            for (const item of pending) {
                // Skip large files on cellular unless forced
                if (!isWifi && item.metadata.distance > 0) {
                    console.log(`Skipping ${item.id} - waiting for WiFi`);
                    continue;
                }

                await this.uploadItem(item);
            }
        } finally {
            this.isProcessing = false;
        }
    }

    private async uploadItem(item: QueuedUpload) {
        try {
            // Update status
            item.status = 'uploading';
            await this.persistQueue();
            this.notifyProgress(item.id, 0, 'uploading');

            // Read file
            const response = await fetch(item.localUri);
            const blob = await response.blob();

            // Upload to Firebase Storage
            const filename = `training/${item.metadata.userId}/${item.id}.mp4`;
            const storageRef = ref(storage, filename);

            const uploadTask = uploadBytesResumable(storageRef, blob);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
                        this.notifyProgress(item.id, progress, 'uploading');
                    },
                    (error) => reject(error),
                    () => resolve()
                );
            });

            // Get download URL
            const downloadUrl = await getDownloadURL(storageRef);

            // Save to Firestore
            await addDoc(collection(db, 'training_clips'), {
                userId: item.metadata.userId,
                sessionId: item.metadata.sessionId,
                videoUrl: downloadUrl,
                distance: item.metadata.distance,
                result: item.metadata.result,
                timestamp: serverTimestamp(),
                uploadedAt: serverTimestamp(),
            });

            // Mark complete
            item.status = 'complete';
            this.notifyProgress(item.id, 1, 'complete');

            // Remove from queue
            this.queue = this.queue.filter(q => q.id !== item.id);
            await this.persistQueue();

            console.log(`Upload complete: ${item.id}`);
        } catch (error) {
            console.error(`Upload failed: ${item.id}`, error);

            item.status = 'failed';
            item.retryCount++;
            await this.persistQueue();
            this.notifyProgress(item.id, 0, 'failed');
        }
    }

    getQueueStatus() {
        return {
            total: this.queue.length,
            pending: this.queue.filter(i => i.status === 'pending').length,
            uploading: this.queue.filter(i => i.status === 'uploading').length,
            failed: this.queue.filter(i => i.status === 'failed').length,
        };
    }

    async clearCompleted() {
        this.queue = this.queue.filter(item => item.status !== 'complete');
        await this.persistQueue();
    }

    async retryFailed() {
        this.queue = this.queue.map(item =>
            item.status === 'failed' ? { ...item, status: 'pending' as const, retryCount: 0 } : item
        );
        await this.persistQueue();
        this.processQueue();
    }
}

export const uploadQueue = new UploadQueue();
