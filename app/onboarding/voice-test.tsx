import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../../services/speech';

type VoiceStatus = 'waiting' | 'listening' | 'detected' | 'confirmed';

export default function VoiceTestScreen() {
    const router = useRouter();
    const [makeStatus, setMakeStatus] = useState<VoiceStatus>('waiting');
    const [missStatus, setMissStatus] = useState<VoiceStatus>('waiting');
    const [isListening, setIsListening] = useState(false);
    const [lastHeard, setLastHeard] = useState<string | null>(null);

    const allConfirmed = makeStatus === 'confirmed' && missStatus === 'confirmed';

    // Simulate voice detection (replace with real speech recognition later)
    const simulateVoice = (command: 'make' | 'miss') => {
        setIsListening(true);
        setLastHeard(command.toUpperCase());

        if (command === 'make' && makeStatus !== 'confirmed') {
            setMakeStatus('detected');
            speechService.playMake();
            setTimeout(() => {
                setMakeStatus('confirmed');
                setIsListening(false);
                setLastHeard(null);
            }, 1000);
        } else if (command === 'miss' && missStatus !== 'confirmed') {
            setMissStatus('detected');
            speechService.playMiss();
            setTimeout(() => {
                setMissStatus('confirmed');
                setIsListening(false);
                setLastHeard(null);
            }, 1000);
        } else {
            setIsListening(false);
            setLastHeard(null);
        }
    };

    const handleContinue = () => {
        router.push('/onboarding/ready');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Voice Test</Text>
                <Text style={styles.subtitle}>
                    Test that we can hear your commands
                </Text>
            </View>

            {/* Microphone visualization */}
            <View style={styles.micContainer}>
                <View style={[
                    styles.micCircle,
                    isListening && styles.micCircleActive
                ]}>
                    <Text style={styles.micEmoji}>🎤</Text>
                    {isListening && (
                        <View style={styles.pulseRing} />
                    )}
                </View>

                {lastHeard ? (
                    <View style={styles.heardContainer}>
                        <Text style={styles.heardLabel}>Heard:</Text>
                        <Text style={styles.heardText}>"{lastHeard}"</Text>
                    </View>
                ) : (
                    <Text style={styles.statusText}>
                        {isListening ? 'Listening...' : 'Tap a button to test'}
                    </Text>
                )}
            </View>

            {/* Voice command status */}
            <View style={styles.commandStatus}>
                <View style={styles.commandRow}>
                    <Text style={styles.commandQuote}>"Make"</Text>
                    <Text style={styles.commandArrow}>→</Text>
                    <Text style={styles.commandResult}>MAKE recorded</Text>
                    <Text style={[
                        styles.commandCheck,
                        makeStatus === 'confirmed' && styles.commandCheckDone
                    ]}>
                        {makeStatus === 'confirmed' ? '✓' : '○'}
                    </Text>
                </View>
                <View style={styles.commandRow}>
                    <Text style={styles.commandQuote}>"Miss"</Text>
                    <Text style={styles.commandArrow}>→</Text>
                    <Text style={styles.commandResult}>MISS recorded</Text>
                    <Text style={[
                        styles.commandCheck,
                        missStatus === 'confirmed' && styles.commandCheckDone
                    ]}>
                        {missStatus === 'confirmed' ? '✓' : '○'}
                    </Text>
                </View>
            </View>

            {/* Test buttons */}
            <View style={styles.testButtons}>
                <Text style={styles.testHint}>
                    Tap to simulate voice (real recognition coming soon)
                </Text>
                <View style={styles.testButtonRow}>
                    <Pressable
                        onPress={() => simulateVoice('make')}
                        style={[
                            styles.voiceButton,
                            makeStatus === 'confirmed' && styles.voiceButtonDone
                        ]}
                        disabled={makeStatus === 'confirmed'}
                    >
                        <Text style={styles.voiceButtonText}>Say "Make"</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => simulateVoice('miss')}
                        style={[
                            styles.voiceButton,
                            missStatus === 'confirmed' && styles.voiceButtonDone
                        ]}
                        disabled={missStatus === 'confirmed'}
                    >
                        <Text style={styles.voiceButtonText}>Say "Miss"</Text>
                    </Pressable>
                </View>
            </View>

            {/* Tip */}
            <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>💡 Tip</Text>
                <Text style={styles.tipText}>
                    Your music or podcast will keep playing!{'\n'}
                    Voice commands work like navigation apps.
                </Text>
            </View>

            <View style={styles.footer}>
                {allConfirmed ? (
                    <Button
                        mode="contained"
                        onPress={handleContinue}
                        style={styles.continueButton}
                        labelStyle={styles.continueButtonLabel}
                    >
                        Voice Working! Continue →
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
    micContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    micCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#333',
        position: 'relative',
    },
    micCircleActive: {
        borderColor: '#6366f1',
        backgroundColor: '#6366f120',
    },
    micEmoji: {
        fontSize: 50,
    },
    pulseRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#6366f155',
    },
    heardContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    heardLabel: {
        fontSize: 14,
        color: '#888',
    },
    heardText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6366f1',
        marginTop: 4,
    },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    commandStatus: {
        paddingHorizontal: 20,
        gap: 12,
    },
    commandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 12,
    },
    commandQuote: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: '600',
        width: 60,
    },
    commandArrow: {
        fontSize: 16,
        color: '#444',
        marginHorizontal: 10,
    },
    commandResult: {
        flex: 1,
        fontSize: 14,
        color: '#888',
    },
    commandCheck: {
        fontSize: 24,
        color: '#444',
    },
    commandCheckDone: {
        color: '#00ff88',
    },
    testButtons: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    testHint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    testButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    voiceButton: {
        flex: 1,
        backgroundColor: '#6366f1',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    voiceButtonDone: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    voiceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    tipBox: {
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#6366f1',
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ddd',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 13,
        color: '#888',
        lineHeight: 20,
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
