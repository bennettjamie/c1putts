import { View } from 'react-native';
import { Text, Button, Card, useTheme, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Play() {
    const [mode, setMode] = useState('free');
    const theme = useTheme();

    const startSession = () => {
        // TODO: Navigate to active session screen (with camera)
        console.log('Starting session:', mode);
        // router.push('/session/active'); 
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 20, fontWeight: 'bold' }}>Start Practice</Text>

            <Card style={{ marginBottom: 20 }}>
                <Card.Title title="Select Mode" />
                <Card.Content>
                    <RadioButton.Group onValueChange={value => setMode(value)} value={mode}>
                        <RadioButton.Item label="Free Putt (Auto-track)" value="free" />
                        <RadioButton.Item label="Ladder Drill" value="ladder" />
                        <RadioButton.Item label="Calibration (5/10/20/30)" value="calibration" />
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Card style={{ marginBottom: 30 }}>
                <Card.Title title="Camera Setup" subtitle="Ensure your phone sees the basket and you." />
                <Card.Content>
                    <Button icon="camera" mode="outlined" onPress={() => { }}>Check View</Button>
                </Card.Content>
            </Card>

            <Button mode="contained" contentStyle={{ height: 50 }} onPress={startSession}>
                Start Session
            </Button>
        </SafeAreaView>
    );
}
