/**
 * Video Recording Service
 * 
 * Handles video capture during training sessions for AI model training.
 */

import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface RecordingMetadata {
    distance: number;
    result: 'make' | 'miss';
    userId: string;
    sessionId: string;
}

export interface TrainingClip {
    id: string;
    userId: string;
    videoUrl: string;
    duration: number;
    distance: number;
    result: 'make' | 'miss';
    timestamp: Date;
    deviceInfo: {
        model: string;
        os: string;
    };
}

class VideoRecorder {
    private cameraRef: Camera | null = null;
    private isRecording = false;
    private currentClipUri: string | null = null;

    setCameraRef(ref: Camera | null) {
        this.cameraRef = ref;
    }

    async startRecording(): Promise<boolean> {
        if (!this.cameraRef || this.isRecording) {
            console.warn('Cannot start recording: camera not ready or already recording');
            return false;
        }

        try {
            this.isRecording = true;
            const video = await this.cameraRef.recordAsync({
                maxDuration: 10, // Max 10 seconds per clip
                quality: Camera.Constants?.VideoQuality?.['720p'] ?? '720p',
            });
            this.currentClipUri = video.uri;
            this.isRecording = false;
            return true;
        } catch (error) {
            console.error('Recording failed:', error);
            this.isRecording = false;
            return false;
        }
    }

    async stopRecording(): Promise<string | null> {
        if (!this.cameraRef || !this.isRecording) {
            return this.currentClipUri;
        }

        try {
            this.cameraRef.stopRecording();
            this.isRecording = false;
            return this.currentClipUri;
        } catch (error) {
            console.error('Stop recording failed:', error);
            return null;
        }
    }

    async uploadClip(
        localUri: string,
        metadata: RecordingMetadata
    ): Promise<string | null> {
        try {
            // Read file as blob
            const response = await fetch(localUri);
            const blob = await response.blob();

            // Generate unique filename
            const filename = `training/${metadata.userId}/${Date.now()}.mp4`;
            const storageRef = ref(storage, filename);

            // Upload to Firebase Storage
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);

            // Save metadata to Firestore
            const clipDoc = await addDoc(collection(db, 'training_clips'), {
                userId: metadata.userId,
                sessionId: metadata.sessionId,
                videoUrl: downloadUrl,
                distance: metadata.distance,
                result: metadata.result,
                timestamp: serverTimestamp(),
                deviceInfo: {
                    model: 'unknown', // TODO: Get from device
                    os: 'unknown',
                },
            });

            console.log('Clip uploaded:', clipDoc.id);

            // Clean up local file
            await FileSystem.deleteAsync(localUri, { idempotent: true });

            return downloadUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            return null;
        }
    }

    getIsRecording() {
        return this.isRecording;
    }
}

export const videoRecorder = new VideoRecorder();
