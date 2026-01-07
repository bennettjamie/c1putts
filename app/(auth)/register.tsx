import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        // TODO: Integrate Firebase Auth
        console.log('Registering', email, password);
        router.replace('/(tabs)');
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={{ marginBottom: 10 }}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 20 }}
            />
            <Button mode="contained" onPress={handleRegister} style={{ marginBottom: 10 }}>
                Sign Up
            </Button>
            <Button onPress={() => router.back()}>
                Back to Login
            </Button>
        </View>
    );
}
