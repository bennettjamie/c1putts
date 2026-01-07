import { View, StyleSheet, Vibration } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Text, Button, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useSessionStore } from '../../core/store';
// import { audioService } from '../../services/audio'; // Enable when audio files added

const DISTANCES = [5, 10, 15, 20, 25, 30];

export default function TrainingActive() {
    const { putters = '5' } = useLocalSearchParams<{ putters: string }>();
    const putterCount = parseInt(putters as string) || 5;

    const [facing, setFacing] = useState<CameraType>('front'); // Selfie camera default
    const [permission, requestPermission] = useCameraPermissions();
    const [currentDistanceIndex, setCurrentDistanceIndex] = useState(0);
    const [currentPutt, setCurrentPutt] = useState(0);
    const [results, setResults] = useState<Array<{ distance: number, result: 'make' | 'miss' }>>([]);
    const [gestureState, setGestureState] = useState<'idle' | 'detecting' | 'confirmed'>('idle');

    const currentDistance = DISTANCES[currentDistanceIndex];
    const { addPutt } = useSessionStore();

    // Initialize audio on mount
    useEffect(() => {
        // audioService.initialize();
        // return () => audioService.cleanup();
    }, []);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Camera permission needed for training</Text>
                <Button mode="contained" onPress={requestPermission}>Grant Permission</Button>
            </View>
        );
    }

    const recordResult = (result: 'make' | 'miss') => {
        // Visual + haptic feedback
        Vibration.vibrate(result === 'make' ? [0, 100, 50, 100] : [0, 200]);
        setGestureState('confirmed');

        // Play sound
        // result === 'make' ? audioService.playMake() : audioService.playMiss();

        // Record data
        const newResult = { distance: currentDistance, result };
        setResults([...results, newResult]);
        addPutt({ ...newResult, timestamp: Date.now() });

        // Advance putt counter
        const nextPutt = currentPutt + 1;

        if (nextPutt >= putterCount) {
            // Round complete - move to next distance
            // audioService.playRoundComplete();

            if (currentDistanceIndex < DISTANCES.length - 1) {
                setCurrentDistanceIndex(currentDistanceIndex + 1);
                setCurrentPutt(0);
            } else {
                // Session complete!
                router.replace('/session/summary');
            }
        } else {
            setCurrentPutt(nextPutt);
        }

        // Reset gesture state after short delay
        setTimeout(() => setGestureState('idle'), 1500);
    };

    const undoLast = () => {
        if (results.length === 0) return;

        Vibration.vibrate(50);
        // audioService.playUndo();

        setResults(results.slice(0, -1));
        if (currentPutt > 0) {
            setCurrentPutt(currentPutt - 1);
        } else if (currentDistanceIndex > 0) {
            setCurrentDistanceIndex(currentDistanceIndex - 1);
            setCurrentPutt(putterCount - 1);
        }
    };

    const makes = results.filter(r => r.distance === currentDistance && r.result === 'make').length;
    const totalAtDistance = results.filter(r => r.distance === currentDistance).length;

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing}>
                <View style={styles.overlay}>
                    {/* Top Status Bar */}
                    <View style={styles.topBar}>
                        <View>
                            <Text style={styles.distanceText}>{currentDistance} ft</Text>
                            <Text style={styles.puttText}>
                                Putt {currentPutt + 1} of {putterCount}
                            </Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsText}>
                                {makes}/{totalAtDistance} makes
                            </Text>
                        </View>
                    </View>

                    {/* Center - Gesture Feedback */}
                    <View style={styles.centerArea}>
                        {gestureState === 'confirmed' && (
                            <View style={[
                                styles.confirmationFlash,
                                {
                                    backgroundColor: results[results.length - 1]?.result === 'make'
                                        ? 'rgba(76, 175, 80, 0.7)'
                                        : 'rgba(244, 67, 54, 0.7)'
                                }
                            ]}>
                                <Text style={styles.confirmationText}>
                                    {results[results.length - 1]?.result === 'make' ? '✓ MAKE!' : '✗ MISS'}
                                </Text>
                            </View>
                        )}

                        {currentPutt === 0 && currentDistanceIndex > 0 && (
                            <View style={styles.roundCompleteBox}>
                                <Text style={styles.roundCompleteText}>
                                    👏 Collect your discs!{'\n'}
                                    Next: {currentDistance} ft
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom Controls - Manual Fallback */}
                    <View style={styles.bottomControls}>
                        <Text style={styles.gestureHint}>
                            👍 Thumbs Up = Make  •  👎 Thumbs Down = Miss
                        </Text>

                        <View style={styles.manualButtons}>
                            <Button
                                mode="contained"
                                buttonColor="#F44336"
                                onPress={() => recordResult('miss')}
                                style={styles.manualBtn}
                            >
                                MISS
                            </Button>
                            <IconButton
                                icon="undo"
                                mode="outlined"
                                onPress={undoLast}
                                disabled={results.length === 0}
                            />
                            <Button
                                mode="contained"
                                buttonColor="#4CAF50"
                                onPress={() => recordResult('make')}
                                style={styles.manualBtn}
                            >
                                MAKE
                            </Button>
                        </View>

                        <View style={styles.actionRow}>
                            <Button
                                mode="outlined"
                                textColor="white"
                                onPress={() => setFacing(f => f === 'front' ? 'back' : 'front')}
                            >
                                Flip Camera
                            </Button>
                            <Button
                                mode="contained"
                                buttonColor="#FF5722"
                                onPress={() => router.replace('/session/summary')}
                            >
                                End Session
                            </Button>
                        </View>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        padding: 20,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    distanceText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    puttText: {
        fontSize: 18,
        color: 'white',
    },
    statsBox: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 8,
    },
    statsText: {
        color: 'white',
        fontSize: 16,
    },
    centerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationFlash: {
        padding: 30,
        borderRadius: 20,
    },
    confirmationText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    roundCompleteBox: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 15,
    },
    roundCompleteText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
    bottomControls: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 15,
        borderRadius: 15,
    },
    gestureHint: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
    },
    manualButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginBottom: 10,
    },
    manualBtn: {
        minWidth: 100,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
