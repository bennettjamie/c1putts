import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { onboardingManager } from '../../core/onboarding';

const PUTTER_OPTIONS = [3, 4, 5, 6, 7, 8];

export default function PutterCountScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState(5); // Default to 5

    const handleContinue = async () => {
        await onboardingManager.setPutterCount(selected);
        router.push('/onboarding/input-method');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>🥏</Text>
                <Text style={styles.title}>How Many Putters?</Text>

                <Text style={styles.subtitle}>
                    How many discs do you have for practice?
                </Text>

                {/* Putter selection */}
                <View style={styles.optionsContainer}>
                    {PUTTER_OPTIONS.map((count) => (
                        <Pressable
                            key={count}
                            onPress={() => setSelected(count)}
                            style={[
                                styles.option,
                                selected === count && styles.optionSelected,
                                count === 5 && styles.optionRecommended,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selected === count && styles.optionTextSelected,
                                ]}
                            >
                                {count}
                            </Text>
                            {count === 5 && (
                                <Text style={styles.recommendedBadge}>★</Text>
                            )}
                        </Pressable>
                    ))}
                </View>

                {/* Recommendation */}
                <View style={styles.tipBox}>
                    <Text style={styles.tipTitle}>💡 We recommend 5 putters</Text>
                    <Text style={styles.tipText}>
                        Easy math on percentages!{'\n'}
                        Each make = 20% at that distance.
                    </Text>
                </View>

                <View style={styles.benefitBox}>
                    <Text style={styles.benefitText}>
                        More putters = More practice + Faster AI learning!
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Continue with {selected} Putters →
                </Button>
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
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 30,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30,
    },
    option: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    optionSelected: {
        backgroundColor: '#00ff88',
    },
    optionRecommended: {
        borderWidth: 2,
        borderColor: '#00ff88',
    },
    optionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    optionTextSelected: {
        color: '#1a1a2e',
    },
    recommendedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        fontSize: 16,
        color: '#FFD700',
    },
    tipBox: {
        backgroundColor: '#00ff8822',
        padding: 20,
        borderRadius: 16,
        width: '100%',
        marginBottom: 15,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00ff88',
        marginBottom: 5,
    },
    tipText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 22,
    },
    benefitBox: {
        backgroundColor: '#ffffff10',
        padding: 15,
        borderRadius: 12,
        width: '100%',
    },
    benefitText: {
        fontSize: 14,
        color: '#ddd',
        textAlign: 'center',
    },
    footer: {
        padding: 30,
    },
    button: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#1a1a2e',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
