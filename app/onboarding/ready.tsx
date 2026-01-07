import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { speechService } from '../../services/speech';
import { onboardingManager } from '../../core/onboarding';

export default function ReadyScreen() {
    const router = useRouter();
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHolding && holdProgress < 1) {
            interval = setInterval(() => {
                setHoldProgress((prev) => {
                    const next = prev + 0.04;
                    if (next >= 1) {
                        handleHighFive();
                        return 1;
                    }
                    return next;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isHolding, holdProgress]);

    const handleHighFive = async () => {
        setIsReady(true);
        await speechService.playHighFive();

        // Complete onboarding
        await onboardingManager.completeOnboarding();

        // Navigate to main app after a moment
        setTimeout(() => {
            router.replace('/(tabs)');
        }, 1500);
    };

    const startHold = () => {
        setIsHolding(true);
    };

    const cancelHold = () => {
        setIsHolding(false);
        setHoldProgress(0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {!isReady ? (
                    <>
                        <Text style={styles.emoji}>✋</Text>
                        <Text style={styles.title}>You're All Set!</Text>

                        <Text style={styles.subtitle}>
                            Give me a HIGH FIVE{'\n'}
                            when you're ready to go!
                        </Text>

                        {/* High-5 button */}
                        <Pressable
                            onPressIn={startHold}
                            onPressOut={cancelHold}
                            style={[
                                styles.highFiveButton,
                                isHolding && styles.highFiveButtonActive,
                            ]}
                        >
                            <Text style={styles.highFiveEmoji}>✋</Text>
                            <View
                                style={[
                                    styles.progressRing,
                                    { transform: [{ scale: 1 + holdProgress * 0.2 }] },
                                ]}
                            />
                        </Pressable>

                        <Text style={styles.instruction}>
                            Hold to start!
                        </Text>

                        {/* Distance preview */}
                        <View style={styles.distancePreview}>
                            <Text style={styles.distanceLabel}>Starting from:</Text>
                            <Text style={styles.distanceValue}>5 feet 🎯</Text>
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.readyEmoji}>🎉</Text>
                        <Text style={styles.readyTitle}>Let's Go!</Text>
                        <Text style={styles.readySubtitle}>
                            Starting your first session...
                        </Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 28,
    },
    highFiveButton: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#00ff8833',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#00ff88',
        position: 'relative',
    },
    highFiveButtonActive: {
        backgroundColor: '#00ff8866',
    },
    highFiveEmoji: {
        fontSize: 70,
    },
    progressRing: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#00ff88',
        opacity: 0.5,
    },
    instruction: {
        fontSize: 16,
        color: '#00ff88',
        marginTop: 20,
    },
    distancePreview: {
        marginTop: 50,
        alignItems: 'center',
    },
    distanceLabel: {
        fontSize: 14,
        color: '#888',
    },
    distanceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00ff88',
        marginTop: 5,
    },
    readyEmoji: {
        fontSize: 100,
        marginBottom: 20,
    },
    readyTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#00ff88',
        marginBottom: 10,
    },
    readySubtitle: {
        fontSize: 18,
        color: '#aaa',
    },
});
