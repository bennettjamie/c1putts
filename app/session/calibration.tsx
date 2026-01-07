import { View } from 'react-native';
import { Text, Button, Card, ProgressBar, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [5, 10, 20, 30];

export default function Calibration() {
    const [stepIndex, setStepIndex] = useState(0);
    const [makes, setMakes] = useState('');

    const currentDistance = STEPS[stepIndex];
    const progress = (stepIndex) / STEPS.length;

    const handleNext = () => {
        // Save data (mocked)
        console.log(`Saved ${makes}/5 at ${currentDistance}ft`);

        if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
            setMakes('');
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text variant="headlineSmall" style={{ marginBottom: 10, fontWeight: 'bold' }}>Calibration Drill</Text>
            <ProgressBar progress={progress} style={{ marginBottom: 20, height: 10, borderRadius: 5 }} />

            <Card style={{ marginBottom: 20 }}>
                <Card.Title title={`Step ${stepIndex + 1}: ${currentDistance} ft`} />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ marginBottom: 20 }}>
                        Stand at {currentDistance} feet. Take 5 putts.
                    </Text>

                    <TextInput
                        mode="outlined"
                        label="How many did you make? (0-5)"
                        keyboardType="numeric"
                        value={makes}
                        onChangeText={setMakes}
                        style={{ marginBottom: 20 }}
                    />
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                onPress={handleNext}
                disabled={!makes || parseInt(makes) > 5}
                contentStyle={{ height: 50 }}
            >
                {stepIndex === STEPS.length - 1 ? "Finish" : "Next Distance"}
            </Button>
        </SafeAreaView>
    );
}
