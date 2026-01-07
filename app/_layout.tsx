import { Slot } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#4CAF50', // Disc Golf Green
        secondary: '#8BC34A',
    },
};

export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <StatusBar style="light" />
            <Slot />
        </PaperProvider>
    );
}
