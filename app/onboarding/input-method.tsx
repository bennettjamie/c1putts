import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { onboardingManager, InputMode } from '../../core/onboarding';

type InputOption = {
    id: InputMode;
    emoji: string;
    title: string;
    description: string;
    pros: string[];
};

const INPUT_OPTIONS: InputOption[] = [
    {
        id: 'gesture',
        emoji: '👍',
        title: 'Gestures',
        description: 'Camera watches for thumbs up/down',
        pros: [
            'Totally hands-free',
            'Works while holding disc',
            'Visual confirmation on screen',
        ],
    },
    {
        id: 'voice',
        emoji: '🎤',
        title: 'Voice',
        description: 'Say "Make" or "Miss" out loud',
        pros: [
            'Works with headphones',
            'Music keeps playing',
            'No camera needed',
        ],
    },
];

export default function InputMethodScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<InputMode | null>(null);

    const handleContinue = async () => {
        if (!selected) return;

        await onboardingManager.setInputMode(selected);

        if (selected === 'gesture') {
            router.push('/onboarding/gesture-test');
        } else {
            router.push('/onboarding/voice-test');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>How do you want to{'\n'}record your putts?</Text>
                    <Text style={styles.subtitle}>
                        Both methods are hands-free while putting
                    </Text>
                </View>

                {/* Input options */}
                <View style={styles.optionsContainer}>
                    {INPUT_OPTIONS.map((option) => (
                        <Pressable
                            key={option.id}
                            onPress={() => setSelected(option.id)}
                            style={[
                                styles.optionCard,
                                selected === option.id && styles.optionCardSelected,
                            ]}
                        >
                            <View style={styles.optionHeader}>
                                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                                <View style={styles.optionTitleContainer}>
                                    <Text style={styles.optionTitle}>{option.title}</Text>
                                    <Text style={styles.optionDescription}>{option.description}</Text>
                                </View>
                                {selected === option.id && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </View>

                            <View style={styles.prosContainer}>
                                {option.pros.map((pro, index) => (
                                    <View key={index} style={styles.proRow}>
                                        <Text style={styles.proBullet}>•</Text>
                                        <Text style={styles.proText}>{pro}</Text>
                                    </View>
                                ))}
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Tip */}
                <View style={styles.tipBox}>
                    <Text style={styles.tipText}>
                        💡 You can switch methods anytime in settings
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    disabled={!selected}
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                >
                    {selected ? `Test ${selected === 'gesture' ? 'Gestures' : 'Voice'} →` : 'Choose an option'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        lineHeight: 36,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: '#00ff88',
        backgroundColor: '#00ff8810',
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    optionTitleContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
    },
    optionDescription: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    checkmark: {
        fontSize: 28,
        color: '#00ff88',
        fontWeight: 'bold',
    },
    prosContainer: {
        gap: 8,
    },
    proRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    proBullet: {
        fontSize: 14,
        color: '#00ff88',
        marginRight: 10,
    },
    proText: {
        fontSize: 14,
        color: '#aaa',
    },
    tipBox: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        alignItems: 'center',
    },
    tipText: {
        fontSize: 14,
        color: '#888',
    },
    footer: {
        padding: 24,
    },
    button: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    buttonDisabled: {
        backgroundColor: '#333',
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#0f0f1a',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
