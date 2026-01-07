import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { speechService } from '../../services/speech';

type GestureStatus = 'waiting' | 'detected' | 'confirmed';

export default function GestureTestScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [thumbsUpStatus, setThumbsUpStatus] = useState<GestureStatus>('waiting');
    const [thumbsDownStatus, setThumbsDownStatus] = useState<GestureStatus>('waiting');
    const [detectedGesture, setDetectedGesture] = useState<string | null>(null);

    const allConfirmed = thumbsUpStatus === 'confirmed' && thumbsDownStatus === 'confirmed';

    // Simulate gesture detection (replace with real MediaPipe later)
    const simulateDetection = (gesture: 'up' | 'down') => {
        setDetectedGesture(gesture === 'up' ? '👍' : '👎');

        if (gesture === 'up' && thumbsUpStatus !== 'confirmed') {
            setThumbsUpStatus('detected');
            speechService.playMake();
            setTimeout(() => {
                setThumbsUpStatus('confirmed');
                setDetectedGesture(null);
            }, 1000);
        } else if (gesture === 'down' && thumbsDownStatus !== 'confirmed') {
            setThumbsDownStatus('detected');
            speechService.playMiss();
            setTimeout(() => {
                setThumbsDownStatus('confirmed');
                setDetectedGesture(null);
            }, 1000);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/ready');
    };

    if (!permission) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.loadingText}>Loading camera...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionEmoji}>📷</Text>
                    <Text style={styles.permissionTitle}>Camera Permission Needed</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to detect your thumbs up/down gestures during practice.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={requestPermission}
                        style={styles.permissionButton}
                        labelStyle={styles.permissionButtonLabel}
                    >
                        Allow Camera Access
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => router.push('/onboarding/input-method')}
                        textColor="#888"
                    >
                        Use Voice Instead
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gesture Test</Text>
                <Text style={styles.subtitle}>
                    Show your gestures to the camera
                </Text>
            </View>

            {/* Camera Preview */}
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="front"
                >
                    {/* Gesture detection overlay */}
                    {detectedGesture && (
                        <View style={styles.detectionOverlay}>
                            <Text style={styles.detectedEmoji}>{detectedGesture}</Text>
                            <Text style={styles.detectedText}>Detected!</Text>
                        </View>
                    )}

                    {/* Guide frame */}
                    <View style={styles.guideFrame}>
                        <Text style={styles.guideText}>Position yourself here</Text>
                    </View>
                </CameraView>
            </View>

            {/* Gesture status */}
            <View style={styles.gestureStatus}>
                <View style={styles.gestureRow}>
                    <Text style={styles.gestureEmoji}>👍</Text>
                    <Text style={styles.gestureLabel}>Thumbs Up = MAKE</Text>
                    <Text style={[
                        styles.gestureCheck,
                        thumbsUpStatus === 'confirmed' && styles.gestureCheckDone
                    ]}>
                        {thumbsUpStatus === 'confirmed' ? '✓' : '○'}
                    </Text>
                </View>
                <View style={styles.gestureRow}>
                    <Text style={styles.gestureEmoji}>👎</Text>
                    <Text style={styles.gestureLabel}>Thumbs Down = MISS</Text>
                    <Text style={[
                        styles.gestureCheck,
                        thumbsDownStatus === 'confirmed' && styles.gestureCheckDone
                    ]}>
                        {thumbsDownStatus === 'confirmed' ? '✓' : '○'}
                    </Text>
                </View>
            </View>

            {/* Test buttons (for MVP - simulates detection) */}
            <View style={styles.testButtons}>
                <Text style={styles.testHint}>Tap to simulate gesture (real detection coming soon)</Text>
                <View style={styles.testButtonRow}>
                    <Button
                        mode="outlined"
                        onPress={() => simulateDetection('up')}
                        style={styles.testButton}
                        disabled={thumbsUpStatus === 'confirmed'}
                    >
                        Test 👍
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => simulateDetection('down')}
                        style={styles.testButton}
                        disabled={thumbsDownStatus === 'confirmed'}
                    >
                        Test 👎
                    </Button>
                </View>
            </View>

            <View style={styles.footer}>
                {allConfirmed ? (
                    <Button
                        mode="contained"
                        onPress={handleContinue}
                        style={styles.continueButton}
                        labelStyle={styles.continueButtonLabel}
                    >
                        Gestures Working! Continue →
                    </Button>
                ) : (
                    <Button
                        mode="text"
                        onPress={handleContinue}
                        textColor="#888"
                    >
                        Skip for now
                    </Button>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#888',
        fontSize: 16,
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
    },
    cameraContainer: {
        marginHorizontal: 20,
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1a1a2e',
    },
    camera: {
        flex: 1,
    },
    detectionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,255,136,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectedEmoji: {
        fontSize: 80,
    },
    detectedText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10,
    },
    guideFrame: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        borderStyle: 'dashed',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    guideText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    gestureStatus: {
        padding: 20,
        gap: 12,
    },
    gestureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 12,
    },
    gestureEmoji: {
        fontSize: 28,
        marginRight: 12,
    },
    gestureLabel: {
        flex: 1,
        fontSize: 16,
        color: 'white',
    },
    gestureCheck: {
        fontSize: 24,
        color: '#444',
    },
    gestureCheckDone: {
        color: '#00ff88',
    },
    testButtons: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    testHint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    testButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    testButton: {
        borderColor: '#444',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    permissionEmoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    permissionText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    permissionButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        marginBottom: 10,
    },
    permissionButtonLabel: {
        color: '#0f0f1a',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
    },
    continueButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    continueButtonLabel: {
        color: '#0f0f1a',
        fontWeight: 'bold',
    },
});
