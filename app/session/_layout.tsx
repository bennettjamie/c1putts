import { Stack } from 'expo-router';

export default function SessionLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="active" />
            <Stack.Screen name="training" />
            <Stack.Screen name="training-active" />
            <Stack.Screen name="calibration" />
            <Stack.Screen name="summary" />
        </Stack>
    );
}
