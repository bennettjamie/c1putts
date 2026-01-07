import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#0f0f1a' },
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="welcome-back" />
            <Stack.Screen name="tutorial" />
            <Stack.Screen name="putter-count" />
            <Stack.Screen name="input-method" />
            <Stack.Screen name="gesture-test" />
            <Stack.Screen name="voice-test" />
            <Stack.Screen name="camera-setup" />
            <Stack.Screen name="calibration" />
            <Stack.Screen name="player-setup" />
            <Stack.Screen name="player-calibration" />
            <Stack.Screen name="ready" />
        </Stack>
    );
}
