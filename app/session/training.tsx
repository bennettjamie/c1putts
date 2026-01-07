import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ProgressBar, SegmentedButtons } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const DISTANCES = [5, 10, 15, 20, 25, 30];
const PUTTER_OPTIONS = ['4', '5', '6', '7+'];

export default function TrainingSetup() {
    const [putterCount, setPutterCount] = useState('5');
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: 'Putter Count', subtitle: 'How many putters are you using?' },
        { title: 'Camera Setup', subtitle: 'Position your phone to see basket and putting area' },
        { title: 'Gesture Practice', subtitle: 'Learn the hand signals' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Start actual training session
            router.push({
                pathname: '/session/training-active',
                params: { putters: putterCount }
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineSmall" style={styles.title}>🎯 Training Mode</Text>
            <ProgressBar progress={(currentStep + 1) / steps.length} style={styles.progress} />

            <Card style={styles.card}>
                <Card.Title
                    title={steps[currentStep].title}
                    subtitle={steps[currentStep].subtitle}
                />
                <Card.Content>
                    {currentStep === 0 && (
                        <>
                            <Text style={styles.helpText}>
                                We'll pause after each round so you can collect your discs.
                            </Text>
                            <SegmentedButtons
                                value={putterCount}
                                onValueChange={setPutterCount}
                                buttons={PUTTER_OPTIONS.map(p => ({ value: p, label: p }))}
                                style={styles.segmented}
                            />
                        </>
                    )}

                    {currentStep === 1 && (
                        <View style={styles.cameraGuide}>
                            <Text style={styles.helpText}>Position your phone so it can see:</Text>
                            <Text style={styles.checkItem}>✓ The basket</Text>
                            <Text style={styles.checkItem}>✓ Your putting line (5-30 ft)</Text>
                            <Text style={styles.checkItem}>✓ You (for gesture detection)</Text>
                            <Text style={styles.tipText}>
                                💡 Tip: Use front camera so you can see yourself, or back camera for sharper video.
                            </Text>
                        </View>
                    )}

                    {currentStep === 2 && (
                        <View style={styles.gestureGuide}>
                            <Text style={styles.helpText}>Practice these gestures (hold for 1 second):</Text>
                            <View style={styles.gestureRow}>
                                <Text style={styles.gestureIcon}>👍</Text>
                                <Text style={styles.gestureText}>Thumbs Up = MAKE</Text>
                            </View>
                            <View style={styles.gestureRow}>
                                <Text style={styles.gestureIcon}>👎</Text>
                                <Text style={styles.gestureText}>Thumbs Down = MISS</Text>
                            </View>
                            <View style={styles.gestureRow}>
                                <Text style={styles.gestureIcon}>✋</Text>
                                <Text style={styles.gestureText}>Open Palm = UNDO</Text>
                            </View>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    contentStyle={styles.buttonContent}
                >
                    {currentStep === steps.length - 1 ? 'Start Training' : 'Next'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progress: {
        height: 8,
        borderRadius: 4,
        marginBottom: 20,
    },
    card: {
        flex: 1,
    },
    helpText: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    segmented: {
        marginTop: 10,
    },
    cameraGuide: {
        marginTop: 10,
    },
    checkItem: {
        fontSize: 18,
        marginVertical: 8,
        color: '#4CAF50',
    },
    tipText: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FFF3CD',
        borderRadius: 8,
        color: '#856404',
    },
    gestureGuide: {
        marginTop: 10,
    },
    gestureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    gestureIcon: {
        fontSize: 40,
        marginRight: 20,
    },
    gestureText: {
        fontSize: 18,
        fontWeight: '500',
    },
    footer: {
        marginTop: 20,
    },
    buttonContent: {
        height: 50,
    },
});
