import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { onboardingManager, OnboardingState } from '../core/onboarding';

// Custom C1Putts Logo Component
function C1PuttsLogo({ size = 80 }: { size?: number }) {
    return (
        <View style={[logoStyles.container, { width: size, height: size }]}>
            <View style={logoStyles.basket}>
                <View style={[logoStyles.pole, { height: size * 0.3 }]} />
                <View style={logoStyles.chains}>
                    <View style={[logoStyles.chain, { height: size * 0.2 }]} />
                    <View style={[logoStyles.chain, { height: size * 0.2 }]} />
                    <View style={[logoStyles.chain, { height: size * 0.2 }]} />
                </View>
                <View style={[logoStyles.ring, { width: size * 0.5 }]} />
            </View>
            <View style={[logoStyles.disc, { left: size * 0.1, top: size * 0.35 }]}>
                <Text style={[logoStyles.discText, { fontSize: size * 0.24 }]}>●</Text>
            </View>
        </View>
    );
}

const logoStyles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    basket: {
        alignItems: 'center',
    },
    pole: {
        width: 4,
        backgroundColor: '#666',
        borderRadius: 2,
    },
    chains: {
        flexDirection: 'row',
        gap: 5,
        marginTop: -2,
    },
    chain: {
        width: 2,
        backgroundColor: '#888',
        borderRadius: 1,
    },
    ring: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00ff88',
        marginTop: -4,
    },
    disc: {
        position: 'absolute',
    },
    discText: {
        color: '#ff6b6b',
        textShadowColor: '#ff6b6b55',
        textShadowRadius: 10,
    },
});

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<OnboardingState | null>(null);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        const onboardingState = await onboardingManager.initialize();
        setState(onboardingState);
        setLoading(false);
    };

    const handleGuestAccess = () => {
        if (state?.isFirstTime) {
            router.push('/onboarding/welcome');
        } else {
            router.push('/onboarding/welcome-back');
        }
    };

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff88" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Background decorations */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <View style={styles.content}>
                <C1PuttsLogo size={90} />

                <Text style={styles.title}>C1Putts</Text>
                <View style={styles.betaBadge}>
                    <Text style={styles.betaText}>BETA</Text>
                </View>

                <Text style={styles.tagline}>
                    Master your putting game with{'\n'}
                    vision-powered tracking
                </Text>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleGuestAccess}
                    style={styles.primaryButton}
                    labelStyle={styles.primaryButtonLabel}
                    contentStyle={styles.buttonContent}
                >
                    Get Started →
                </Button>

                <Button
                    mode="outlined"
                    onPress={handleLogin}
                    style={styles.secondaryButton}
                    labelStyle={styles.secondaryButtonLabel}
                    contentStyle={styles.buttonContent}
                >
                    Log In
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
        overflow: 'hidden',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0f0f1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#00ff8808',
        top: -100,
        right: -100,
    },
    bgCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#6366f108',
        bottom: 100,
        left: -50,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 52,
        fontWeight: '800',
        color: '#00ff88',
        letterSpacing: 3,
        marginTop: 20,
    },
    betaBadge: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 12,
    },
    betaText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    tagline: {
        fontSize: 17,
        color: '#888',
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 26,
    },
    footer: {
        padding: 30,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    primaryButtonLabel: {
        color: '#0f0f1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderColor: '#444',
        borderRadius: 30,
    },
    secondaryButtonLabel: {
        color: '#888',
        fontSize: 16,
    },
});
