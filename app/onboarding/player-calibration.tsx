import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { speechService } from '../../services/speech';

const SHIRT_COLORS: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    white: '#f5f5f5',
    black: '#1a1a1a',
    orange: '#f97316',
    purple: '#a855f7',
};

type CalibrationStep = 'intro' | 'p1' | 'p2' | 'done';

export default function PlayerCalibrationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [permission] = useCameraPermissions();
    const [step, setStep] = useState<CalibrationStep>('intro');
    const [isDetecting, setIsDetecting] = useState(false);

    const p1Name = (params.p1Name as string) || 'Player 1';
    const p2Name = (params.p2Name as string) || 'Player 2';
    const p1Shirt = params.p1Shirt as string;
    const p2Shirt = params.p2Shirt as string;

    const handleStartCalibration = async () => {
        setStep('p1');
        await speechService.speak(`${p1Name}, you're wearing ${p1Shirt}. Stand near the camera and wave.`);
    };

    const simulatePlayerDetected = async () => {
        setIsDetecting(true);

        if (step === 'p1') {
            await speechService.speak(`Got it ${p1Name}! I'll recognize you by your ${p1Shirt} shirt.`);
            setTimeout(() => {
                setIsDetecting(false);
                setStep('p2');
                speechService.speak(`${p2Name}, now you wave. You're wearing ${p2Shirt}.`);
            }, 1500);
        } else if (step === 'p2') {
            await speechService.speak(`Perfect ${p2Name}! I can tell you apart now.`);
            setTimeout(() => {
                setIsDetecting(false);
                setStep('done');
                speechService.speak(`Great! You're both registered. Stand staggered at the same distance so I can see you both.`);
            }, 1500);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/ready');
    };

    const currentPlayer = step === 'p1' ? { name: p1Name, shirt: p1Shirt }
        : step === 'p2' ? { name: p2Name, shirt: p2Shirt }
            : null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Camera */}
            <View style={styles.cameraContainer}>
                {permission?.granted ? (
                    <CameraView style={styles.camera} facing="front">
                        {/* Detection overlay */}
                        {isDetecting && (
                            <View style={styles.detectedOverlay}>
                                <Text style={styles.detectedEmoji}>✓</Text>
                            </View>
                        )}

                        {/* Current player indicator */}
                        {currentPlayer && !isDetecting && (
                            <View style={styles.playerOverlay}>
                                <View style={[
                                    styles.shirtIndicator,
                                    { backgroundColor: SHIRT_COLORS[currentPlayer.shirt] }
                                ]} />
                                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                                <Text style={styles.playerInstruction}>Wave at the camera!</Text>
                            </View>
                        )}
                    </CameraView>
                ) : (
                    <View style={styles.noCameraPlaceholder}>
                        <Text style={styles.noCameraText}>Camera access needed</Text>
                    </View>
                )}
            </View>

            {/* Status */}
            <View style={styles.statusArea}>
                {step === 'intro' && (
                    <View style={styles.introContent}>
                        <Text style={styles.introTitle}>Two-Player Setup</Text>
                        <Text style={styles.introText}>
                            We'll identify each player by shirt color.{'\n\n'}
                            Stand near the camera one at a time and wave.
                        </Text>

                        {/* Player preview */}
                        <View style={styles.playersPreview}>
                            <View style={styles.playerPreview}>
                                <View style={[styles.previewShirt, { backgroundColor: SHIRT_COLORS[p1Shirt] }]} />
                                <Text style={styles.previewName}>{p1Name}</Text>
                            </View>
                            <Text style={styles.vsText}>vs</Text>
                            <View style={styles.playerPreview}>
                                <View style={[styles.previewShirt, { backgroundColor: SHIRT_COLORS[p2Shirt] }]} />
                                <Text style={styles.previewName}>{p2Name}</Text>
                            </View>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleStartCalibration}
                            style={styles.startButton}
                            labelStyle={styles.startButtonLabel}
                        >
                            Start Setup
                        </Button>
                    </View>
                )}

                {(step === 'p1' || step === 'p2') && (
                    <View style={styles.calibratingContent}>
                        {/* Progress */}
                        <View style={styles.progressRow}>
                            <View style={[styles.progressDot, step !== 'intro' && styles.progressDotActive]} />
                            <View style={[styles.progressLine, step === 'p2' && styles.progressLineActive]} />
                            <View style={[styles.progressDot, step === 'p2' && styles.progressDotActive]} />
                        </View>

                        <Text style={styles.calibratingTitle}>
                            {currentPlayer?.name}, wave at the camera!
                        </Text>

                        <View style={styles.shirtReminder}>
                            <Text style={styles.shirtReminderText}>
                                Wearing: {currentPlayer?.shirt.toUpperCase()}
                            </Text>
                            <View style={[
                                styles.shirtReminderChip,
                                { backgroundColor: SHIRT_COLORS[currentPlayer?.shirt || 'blue'] }
                            ]} />
                        </View>

                        <Button
                            mode="contained"
                            onPress={simulatePlayerDetected}
                            style={styles.waveButton}
                            labelStyle={styles.waveButtonLabel}
                            disabled={isDetecting}
                        >
                            {isDetecting ? 'Detected! ✓' : '👋 Simulate Wave'}
                        </Button>
                        <Text style={styles.mvpNote}>
                            Tap to simulate (real detection coming soon)
                        </Text>
                    </View>
                )}

                {step === 'done' && (
                    <View style={styles.doneContent}>
                        <Text style={styles.doneEmoji}>🎉</Text>
                        <Text style={styles.doneTitle}>Both Players Registered!</Text>

                        <View style={styles.finalPlayers}>
                            <View style={styles.finalPlayer}>
                                <View style={[styles.finalShirt, { backgroundColor: SHIRT_COLORS[p1Shirt] }]} />
                                <Text style={styles.finalName}>{p1Name}</Text>
                            </View>
                            <Text style={styles.finalVs}>vs</Text>
                            <View style={styles.finalPlayer}>
                                <View style={[styles.finalShirt, { backgroundColor: SHIRT_COLORS[p2Shirt] }]} />
                                <Text style={styles.finalName}>{p2Name}</Text>
                            </View>
                        </View>

                        <Text style={styles.doneHint}>
                            💡 Stand staggered at the same distance so the camera can see you both
                        </Text>

                        <Button
                            mode="contained"
                            onPress={handleContinue}
                            style={styles.continueButton}
                            labelStyle={styles.continueButtonLabel}
                        >
                            Let's Play! →
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
    cameraContainer: {
        height: 260,
        margin: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1a1a2e',
    },
    camera: {
        flex: 1,
    },
    noCameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCameraText: {
        color: '#666',
    },
    detectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,255,136,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectedEmoji: {
        fontSize: 100,
        color: 'white',
    },
    playerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    shirtIndicator: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 12,
        borderWidth: 4,
        borderColor: 'white',
    },
    playerName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    playerInstruction: {
        fontSize: 18,
        color: '#ccc',
    },
    statusArea: {
        flex: 1,
        padding: 24,
    },
    introContent: {
        flex: 1,
        alignItems: 'center',
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    introText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    playersPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 30,
    },
    playerPreview: {
        alignItems: 'center',
    },
    previewShirt: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    previewName: {
        color: 'white',
        fontWeight: '600',
    },
    vsText: {
        color: '#666',
        fontSize: 16,
    },
    startButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingHorizontal: 40,
    },
    startButtonLabel: {
        color: '#0f0f1a',
        fontSize: 17,
        fontWeight: 'bold',
    },
    calibratingContent: {
        alignItems: 'center',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    progressDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    progressDotActive: {
        backgroundColor: '#00ff88',
    },
    progressLine: {
        width: 60,
        height: 3,
        backgroundColor: '#333',
        marginHorizontal: 8,
    },
    progressLineActive: {
        backgroundColor: '#00ff88',
    },
    calibratingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        textAlign: 'center',
    },
    shirtReminder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
    },
    shirtReminderText: {
        color: '#888',
        fontSize: 14,
    },
    shirtReminderChip: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    waveButton: {
        backgroundColor: '#6366f1',
        borderRadius: 30,
        paddingHorizontal: 40,
    },
    waveButtonLabel: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    mvpNote: {
        marginTop: 10,
        fontSize: 12,
        color: '#666',
    },
    doneContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneEmoji: {
        fontSize: 60,
        marginBottom: 12,
    },
    doneTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00ff88',
        marginBottom: 20,
    },
    finalPlayers: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20,
    },
    finalPlayer: {
        alignItems: 'center',
    },
    finalShirt: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 6,
    },
    finalName: {
        color: 'white',
        fontWeight: '600',
    },
    finalVs: {
        color: '#666',
    },
    doneHint: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    continueButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingHorizontal: 40,
    },
    continueButtonLabel: {
        color: '#0f0f1a',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
