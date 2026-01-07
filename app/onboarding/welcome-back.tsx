import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeBackProps {
    onSameLocation: () => void;
    onNewLocation: () => void;
}

export default function WelcomeBackScreen() {
    const router = useRouter();

    const handleSameLocation = () => {
        // Quick start - go directly to ready screen
        router.push('/onboarding/ready');
    };

    const handleNewLocation = () => {
        // New location - do gesture calibration
        router.push('/onboarding/gesture-test');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>👋</Text>
                <Text style={styles.title}>Welcome Back!</Text>

                <Text style={styles.question}>Same place as last time?</Text>

                <View style={styles.buttonGroup}>
                    <Button
                        mode="contained"
                        onPress={handleSameLocation}
                        style={styles.primaryButton}
                        labelStyle={styles.primaryButtonLabel}
                    >
                        Yes – Quick Start →
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={handleNewLocation}
                        style={styles.secondaryButton}
                        labelStyle={styles.secondaryButtonLabel}
                    >
                        No – New Location
                    </Button>
                </View>

                {/* Beta reminder */}
                <View style={styles.reminderBox}>
                    <Text style={styles.reminderTitle}>🔔 Beta Reminder</Text>
                    <Text style={styles.reminderText}>
                        Your putts help train the AI for everyone!
                    </Text>
                </View>
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
        marginBottom: 30,
    },
    question: {
        fontSize: 20,
        color: '#aaa',
        marginBottom: 30,
    },
    buttonGroup: {
        width: '100%',
        gap: 15,
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingVertical: 8,
    },
    primaryButtonLabel: {
        color: '#1a1a2e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderColor: '#666',
        borderRadius: 30,
        paddingVertical: 8,
    },
    secondaryButtonLabel: {
        color: '#aaa',
        fontSize: 16,
    },
    reminderBox: {
        backgroundColor: '#ff6b6b22',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        borderLeftWidth: 4,
        borderLeftColor: '#ff6b6b',
    },
    reminderTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: 5,
    },
    reminderText: {
        fontSize: 13,
        color: '#aaa',
    },
});
