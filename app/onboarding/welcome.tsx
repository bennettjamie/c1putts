import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { speechService } from '../../services/speech';

// Custom C1Putts Logo Component
function C1PuttsLogo() {
    return (
        <View style={logoStyles.container}>
            {/* Basket/chains icon */}
            <View style={logoStyles.basket}>
                <View style={logoStyles.pole} />
                <View style={logoStyles.chains}>
                    <View style={logoStyles.chain} />
                    <View style={logoStyles.chain} />
                    <View style={logoStyles.chain} />
                </View>
                <View style={logoStyles.ring} />
            </View>
            {/* Disc flying toward basket */}
            <View style={logoStyles.disc}>
                <Text style={logoStyles.discText}>●</Text>
            </View>
        </View>
    );
}

const logoStyles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    basket: {
        alignItems: 'center',
    },
    pole: {
        width: 4,
        height: 30,
        backgroundColor: '#666',
        borderRadius: 2,
    },
    chains: {
        flexDirection: 'row',
        gap: 6,
        marginTop: -2,
    },
    chain: {
        width: 2,
        height: 20,
        backgroundColor: '#888',
        borderRadius: 1,
    },
    ring: {
        width: 50,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00ff88',
        marginTop: -4,
    },
    disc: {
        position: 'absolute',
        left: 10,
        top: 35,
    },
    discText: {
        fontSize: 24,
        color: '#ff6b6b',
        textShadowColor: '#ff6b6b55',
        textShadowRadius: 10,
    },
});

export default function WelcomeScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            speechService.playWelcome();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Decorative background elements */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <View style={styles.content}>
                {/* Logo */}
                <C1PuttsLogo />

                <Text style={styles.title}>C1Putts</Text>
                <View style={styles.betaBadge}>
                    <Text style={styles.betaText}>BETA</Text>
                </View>

                <View style={styles.tagline}>
                    <Text style={styles.welcomeText}>Welcome to the Beta!</Text>
                    <Text style={styles.guaranteeText}>
                        We <Text style={styles.guaranteeHighlight}>GUARANTEE</Text> improvement
                    </Text>
                    <Text style={styles.subText}>
                        through data-driven practice
                    </Text>
                </View>

                <View style={styles.features}>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureIcon}>🎯</Text>
                        <Text style={styles.featureText}>Track every putt from 5-50 feet</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureIcon}>👍</Text>
                        <Text style={styles.featureText}>Hands-free gesture tracking</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureIcon}>🤖</Text>
                        <Text style={styles.featureText}>You help train the AI for everyone</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => router.push('/onboarding/tutorial')}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                >
                    Get Started →
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
        marginTop: 40,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 22,
        color: 'white',
        fontWeight: '600',
        marginBottom: 12,
    },
    guaranteeText: {
        fontSize: 18,
        color: '#aaa',
    },
    guaranteeHighlight: {
        color: '#00ff88',
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    features: {
        marginTop: 50,
        gap: 16,
        width: '100%',
        maxWidth: 320,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 12,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 14,
    },
    featureText: {
        fontSize: 15,
        color: '#ccc',
        flex: 1,
    },
    footer: {
        padding: 30,
    },
    button: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#0f0f1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
