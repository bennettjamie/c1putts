import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, IconButton, Card } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { uploadQueue } from '../core/video/uploader';

interface UploadStatusProps {
    minimal?: boolean;
}

/**
 * Shows current upload queue status
 * Can be minimal (just icon + count) or expanded (full progress)
 */
export function UploadStatus({ minimal = false }: UploadStatusProps) {
    const [status, setStatus] = useState(uploadQueue.getQueueStatus());
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Refresh status periodically
        const interval = setInterval(() => {
            setStatus(uploadQueue.getQueueStatus());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const hasPending = status.pending > 0 || status.uploading > 0;
    const hasFailed = status.failed > 0;

    if (minimal) {
        return (
            <View style={styles.minimal}>
                {hasPending && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            ☁️ {status.pending + status.uploading}
                        </Text>
                    </View>
                )}
                {hasFailed && (
                    <View style={[styles.badge, styles.failedBadge]}>
                        <Text style={styles.badgeText}>⚠️ {status.failed}</Text>
                    </View>
                )}
            </View>
        );
    }

    if (status.total === 0) {
        return null;
    }

    return (
        <Card style={styles.card}>
            <Card.Title
                title="Upload Queue"
                right={(props) => (
                    <IconButton
                        {...props}
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        onPress={() => setIsExpanded(!isExpanded)}
                    />
                )}
            />

            {isExpanded && (
                <Card.Content>
                    <View style={styles.row}>
                        <Text>Pending:</Text>
                        <Text style={styles.count}>{status.pending}</Text>
                    </View>

                    {status.uploading > 0 && (
                        <View style={styles.row}>
                            <Text>Uploading:</Text>
                            <ProgressBar
                                progress={0.5}
                                style={styles.progress}
                            />
                        </View>
                    )}

                    {status.failed > 0 && (
                        <View style={styles.row}>
                            <Text style={styles.failed}>Failed:</Text>
                            <Text style={[styles.count, styles.failed]}>{status.failed}</Text>
                            <IconButton
                                icon="refresh"
                                size={20}
                                onPress={() => uploadQueue.retryFailed()}
                            />
                        </View>
                    )}
                </Card.Content>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    minimal: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    failedBadge: {
        backgroundColor: 'rgba(244,67,54,0.8)',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    card: {
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    count: {
        fontWeight: 'bold',
    },
    progress: {
        flex: 1,
        marginLeft: 10,
        height: 8,
        borderRadius: 4,
    },
    failed: {
        color: '#F44336',
    },
});
