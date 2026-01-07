import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Text, Button, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

type PlayerMode = 'solo' | 'duo';

interface PlayerInfo {
    name: string;
    shirtColor: string;
}

const SHIRT_COLORS = [
    { id: 'red', color: '#ef4444', label: 'Red' },
    { id: 'blue', color: '#3b82f6', label: 'Blue' },
    { id: 'green', color: '#22c55e', label: 'Green' },
    { id: 'yellow', color: '#eab308', label: 'Yellow' },
    { id: 'white', color: '#f5f5f5', label: 'White' },
    { id: 'black', color: '#1a1a1a', label: 'Black' },
    { id: 'orange', color: '#f97316', label: 'Orange' },
    { id: 'purple', color: '#a855f7', label: 'Purple' },
];

export default function PlayerSetupScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<PlayerMode>('solo');
    const [player1, setPlayer1] = useState<PlayerInfo>({ name: '', shirtColor: '' });
    const [player2, setPlayer2] = useState<PlayerInfo>({ name: '', shirtColor: '' });
    const [useAnonymous, setUseAnonymous] = useState(true);

    const canContinue = mode === 'solo'
        ? true
        : (player1.shirtColor && player2.shirtColor && player1.shirtColor !== player2.shirtColor);

    const handleContinue = () => {
        // Pass player info to next screen
        if (mode === 'duo') {
            router.push({
                pathname: '/onboarding/player-calibration',
                params: {
                    mode: 'duo',
                    p1Name: player1.name || 'Player 1',
                    p1Shirt: player1.shirtColor,
                    p2Name: player2.name || 'Player 2',
                    p2Shirt: player2.shirtColor,
                }
            });
        } else {
            router.push('/onboarding/ready');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Who's Playing?</Text>

                {/* Mode toggle */}
                <View style={styles.modeToggle}>
                    <Pressable
                        onPress={() => setMode('solo')}
                        style={[styles.modeButton, mode === 'solo' && styles.modeButtonActive]}
                    >
                        <Text style={styles.modeEmoji}>🧍</Text>
                        <Text style={[styles.modeText, mode === 'solo' && styles.modeTextActive]}>
                            Solo Practice
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setMode('duo')}
                        style={[styles.modeButton, mode === 'duo' && styles.modeButtonActive]}
                    >
                        <Text style={styles.modeEmoji}>👥</Text>
                        <Text style={[styles.modeText, mode === 'duo' && styles.modeTextActive]}>
                            Two Players
                        </Text>
                    </Pressable>
                </View>

                {mode === 'duo' && (
                    <>
                        {/* Anonymous toggle */}
                        <View style={styles.anonymousRow}>
                            <Text style={styles.anonymousLabel}>Use names?</Text>
                            <Switch
                                value={!useAnonymous}
                                onValueChange={(v) => setUseAnonymous(!v)}
                                color="#00ff88"
                            />
                        </View>

                        {/* Player 1 */}
                        <View style={styles.playerCard}>
                            <Text style={styles.playerLabel}>Player 1</Text>
                            {!useAnonymous && (
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="Name (optional)"
                                    placeholderTextColor="#666"
                                    value={player1.name}
                                    onChangeText={(t) => setPlayer1({ ...player1, name: t })}
                                />
                            )}
                            <Text style={styles.shirtLabel}>Shirt color:</Text>
                            <View style={styles.colorGrid}>
                                {SHIRT_COLORS.map((c) => (
                                    <Pressable
                                        key={c.id}
                                        onPress={() => setPlayer1({ ...player1, shirtColor: c.id })}
                                        style={[
                                            styles.colorChip,
                                            { backgroundColor: c.color },
                                            player1.shirtColor === c.id && styles.colorChipSelected,
                                            player2.shirtColor === c.id && styles.colorChipDisabled,
                                        ]}
                                        disabled={player2.shirtColor === c.id}
                                    >
                                        {player1.shirtColor === c.id && (
                                            <Text style={styles.colorCheck}>✓</Text>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Player 2 */}
                        <View style={styles.playerCard}>
                            <Text style={styles.playerLabel}>Player 2</Text>
                            {!useAnonymous && (
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder="Name (optional)"
                                    placeholderTextColor="#666"
                                    value={player2.name}
                                    onChangeText={(t) => setPlayer2({ ...player2, name: t })}
                                />
                            )}
                            <Text style={styles.shirtLabel}>Shirt color:</Text>
                            <View style={styles.colorGrid}>
                                {SHIRT_COLORS.map((c) => (
                                    <Pressable
                                        key={c.id}
                                        onPress={() => setPlayer2({ ...player2, shirtColor: c.id })}
                                        style={[
                                            styles.colorChip,
                                            { backgroundColor: c.color },
                                            player2.shirtColor === c.id && styles.colorChipSelected,
                                            player1.shirtColor === c.id && styles.colorChipDisabled,
                                        ]}
                                        disabled={player1.shirtColor === c.id}
                                    >
                                        {player2.shirtColor === c.id && (
                                            <Text style={styles.colorCheck}>✓</Text>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Tip */}
                        <View style={styles.tipBox}>
                            <Text style={styles.tipText}>
                                💡 Different shirt colors help the camera tell you apart from 30 feet away
                            </Text>
                        </View>
                    </>
                )}

                {mode === 'solo' && (
                    <View style={styles.soloInfo}>
                        <Text style={styles.soloEmoji}>🎯</Text>
                        <Text style={styles.soloText}>
                            Focus on your game.{'\n'}
                            Track every putt from 5-30 feet.
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    disabled={!canContinue}
                    style={[styles.button, !canContinue && styles.buttonDisabled]}
                    labelStyle={styles.buttonLabel}
                >
                    {mode === 'duo' ? 'Set Up Players →' : 'Ready to Putt! →'}
                </Button>
                {mode === 'duo' && !canContinue && (
                    <Text style={styles.errorText}>
                        Select different shirt colors for each player
                    </Text>
                )}
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
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        marginBottom: 24,
    },
    modeToggle: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    modeButton: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    modeButtonActive: {
        borderColor: '#00ff88',
        backgroundColor: '#00ff8810',
    },
    modeEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    modeText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    modeTextActive: {
        color: '#00ff88',
    },
    anonymousRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    anonymousLabel: {
        color: '#888',
        fontSize: 14,
    },
    playerCard: {
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    playerLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
    },
    nameInput: {
        backgroundColor: '#0f0f1a',
        color: 'white',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    shirtLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    colorChip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorChipSelected: {
        borderColor: '#00ff88',
        transform: [{ scale: 1.1 }],
    },
    colorChipDisabled: {
        opacity: 0.3,
    },
    colorCheck: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowRadius: 2,
    },
    tipBox: {
        backgroundColor: '#00ff8815',
        padding: 14,
        borderRadius: 12,
    },
    tipText: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
    },
    soloInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    soloEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    soloText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        lineHeight: 28,
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
    buttonLabel: {
        color: '#0f0f1a',
        fontSize: 17,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
    },
});
