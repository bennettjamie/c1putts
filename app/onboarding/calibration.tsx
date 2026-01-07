import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { speechService } from '../../services/speech';

type CalibrationStep = 'intro' | 'close' | 'mid' | 'far' | 'done';

const CALIBRATION_STEPS = {
    close: { distance: 5, instruction: 'Stand 5 feet away and WAVE' },
    mid: { distance: 15, instruction: 'Back up to 15 feet and WAVE' },
    far: { distance: 30, instruction: 'Go to C1 (30 feet) and WAVE' },
};

export default function CalibrationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const cameraFacing = params.camera === 'rear' ? 'back' : 'front';
    const isRearCamera = params.camera === 'rear';

    const [permission, requestPermission] = useCameraPermissions();
    const [step, setStep] = useState<CalibrationStep>('intro');
    const [isWaving, setIsWaving] = useState(false);
    const [detectedWaves, setDetectedWaves] = useState<number[]>([]);

    // Speak instructions via audio (critical for rear camera)
    const speakInstruction = useCallback(async (text: string) => {
        await speechService.speak(text);
    }, []);

    const handleStartCalibration = async () => {
        setStep('close');
        await speakInstruction('Stand 5 feet from the phone and wave at the camera');
    };

    const simulateWaveDetected = async () => {
        setIsWaving(true);
        await speakInstruction('Got it!');

        setTimeout(() => {
            setIsWaving(false);

            if (step === 'close') {
                setDetectedWaves([5]);
                setStep('mid');
                speakInstruction('Great! Now back up to 15 feet and wave again');
            } else if (step === 'mid') {
                setDetectedWaves([5, 15]);
                setStep('far');
                speakInstruction('Perfect! Now go to the C1 line, 30 feet, and wave');
            } else if (step === 'far') {
                setDetectedWaves([5, 15, 30]);
                setStep('done');
                speakInstruction('Excellent! I can see you at all distances. Youre ready to practice!');
            }
        }, 1500);
    };

    const handleContinue = () => {
        router.push('/onboarding/player-setup');
    };

    if (!permission) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionEmoji}>📷</Text>
                    <Text style={styles.permissionTitle}>Camera Access Needed</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to detect your gestures during practice.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={requestPermission}
                        style={styles.permissionButton}
                        labelStyle={styles.permissionButtonLabel}
                    >
                        Allow Camera
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Camera Preview */}
            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} facing={cameraFacing}>
                    {/* Detection overlay */}
                    {isWaving && (
                        <View style={styles.detectedOverlay}>
                            <Text style={styles.detectedEmoji}>✓</Text>
                        </View>
                    )}

                    {/* Large instruction overlay - visible from 30 feet */}
                    {step !== 'intro' && step !== 'done' && (
                        <View style={styles.instructionOverlay}>
                            <Text style={styles.bigEmoji}>👋</Text>
                            <Text style={styles.bigInstruction}>
                                {CALIBRATION_STEPS[step]?.instruction}
                            </Text>
                        </View>
                    )}
                </CameraView>
            </View>

            {/* Status area */}
            <View style={styles.statusArea}>
                {step === 'intro' && (
                    <View style={styles.introContent}>
                        <Text style={styles.introTitle}>Progressive Calibration</Text>
                        <Text style={styles.introText}>
                            We'll test that the camera can see you at different distances.
                            {isRearCamera && '\n\n🎧 Using rear camera - listen for audio prompts!'}
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleStartCalibration}
                            style={styles.startButton}
                            labelStyle={styles.startButtonLabel}
                        >
                            Start Calibration
                        </Button>
                    </View>
                )}

                {step !== 'intro' && step !== 'done' && (
                    <View style={styles.progressContent}>
                        {/* Distance indicators */}
                        <View style={styles.distanceIndicators}>
                            {[5, 15, 30].map((d) => (
                                <View
                                    key={d}
                                    style={[
                                        styles.distanceChip,
                                        detectedWaves.includes(d) && styles.distanceChipDone,
                                        CALIBRATION_STEPS[step]?.distance === d && styles.distanceChipActive,
                                    ]}
                                >
                                    <Text style={[
                                        styles.distanceText,
                                        detectedWaves.includes(d) && styles.distanceTextDone,
                                    ]}>
                                        {d}ft {detectedWaves.includes(d) ? '✓' : ''}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Simulate button (for MVP) */}
                        <Button
                            mode="contained"
                            onPress={simulateWaveDetected}
                            style={styles.waveButton}
                            labelStyle={styles.waveButtonLabel}
                            disabled={isWaving}
                        >
                            {isWaving ? 'Detected! ✓' : '👋 Simulate Wave'}
                        </Button>
                        <Text style={styles.mvpNote}>
                            Tap to simulate (real detection coming soon)
                        </Text>
                    </View>
                )}

                {step === 'done' && (
                    <View style={styles.doneContent}>
                        <Text style={styles.doneEmoji}>🎉</Text>
                        <Text style={styles.doneTitle}>Calibration Complete!</Text>
                        <Text style={styles.doneText}>
                            I can see you at 5ft, 15ft, and 30ft.
                            You're ready to start practicing!
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleContinue}
                            style={styles.continueButton}
                            labelStyle={styles.continueButtonLabel}
                        >
                            Continue →
                        </Button>
                    </View>
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
    cameraContainer: {
        height: 300,
        margin: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1a1a2e',
    },
    camera: {
        flex: 1,
    },
    detectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,255,136,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectedEmoji: {
        fontSize: 120,
        color: 'white',
    },
    instructionOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bigEmoji: {
        fontSize: 100,
        marginBottom: 10,
    },
    bigInstruction: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    statusArea: {
        flex: 1,
        padding: 24,
    },
    introContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    introText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingHorizontal: 30,
    },
    startButtonLabel: {
        color: '#0f0f1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressContent: {
        alignItems: 'center',
    },
    distanceIndicators: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    distanceChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1a1a2e',
        borderWidth: 2,
        borderColor: '#333',
    },
    distanceChipActive: {
        borderColor: '#00ff88',
    },
    distanceChipDone: {
        backgroundColor: '#00ff8820',
        borderColor: '#00ff88',
    },
    distanceText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    distanceTextDone: {
        color: '#00ff88',
    },
    waveButton: {
        backgroundColor: '#6366f1',
        borderRadius: 30,
        paddingHorizontal: 40,
    },
    waveButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mvpNote: {
        marginTop: 12,
        fontSize: 12,
        color: '#666',
    },
    doneContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    doneTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00ff88',
        marginBottom: 12,
    },
    doneText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    continueButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingHorizontal: 40,
    },
    continueButtonLabel: {
        color: '#0f0f1a',
        fontSize: 18,
        fontWeight: 'bold',
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
        marginBottom: 30,
    },
    permissionButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    permissionButtonLabel: {
        color: '#0f0f1a',
        fontWeight: 'bold',
    },
});
