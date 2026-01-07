import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { speechService } from '../../services/speech';
import { TRAINING_LADDER } from '../../core/utils/distance';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PuttResult {
    index: number;
    result: 'make' | 'miss' | 'pending';
}

interface RoundData {
    distance: number;
    putts: PuttResult[];
    completed: boolean;
}

export default function ActiveSessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();

    // Session state
    const [putterCount] = useState(parseInt(params.putterCount as string) || 5);
    const [unit] = useState((params.unit as string) || 'feet');
    const [distances] = useState(TRAINING_LADDER.feet);
    const [currentDistanceIndex, setCurrentDistanceIndex] = useState(0);
    const [currentPutts, setCurrentPutts] = useState<PuttResult[]>([]);
    const [sessionData, setSessionData] = useState<RoundData[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    const currentDistance = distances[currentDistanceIndex];
    const completedPutts = currentPutts.filter(p => p.result !== 'pending').length;
    const makes = currentPutts.filter(p => p.result === 'make').length;

    // Request camera permission on mount
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    // Initialize putts for current round
    useEffect(() => {
        initializeRound();
    }, [currentDistanceIndex]);

    const initializeRound = () => {
        const putts: PuttResult[] = Array.from({ length: putterCount }, (_, i) => ({
            index: i,
            result: 'pending',
        }));
        setCurrentPutts(putts);
    };

    // Record a putt result
    const recordPutt = useCallback(async (result: 'make' | 'miss') => {
        const pendingIndex = currentPutts.findIndex(p => p.result === 'pending');
        if (pendingIndex === -1) return;

        // Play sound
        if (result === 'make') {
            await speechService.playChains();
        } else {
            await speechService.playClank();
        }

        // Update putt
        const newPutts = [...currentPutts];
        newPutts[pendingIndex] = { ...newPutts[pendingIndex], result };
        setCurrentPutts(newPutts);

        // Check if round complete
        const allDone = newPutts.every(p => p.result !== 'pending');
        if (allDone) {
            handleRoundComplete(newPutts);
        }
    }, [currentPutts]);

    // Toggle a putt result (for corrections)
    const togglePutt = (index: number) => {
        const newPutts = [...currentPutts];
        const current = newPutts[index].result;

        if (current === 'make') {
            newPutts[index].result = 'miss';
            speechService.playClank();
        } else if (current === 'miss') {
            newPutts[index].result = 'make';
            speechService.playChains();
        }

        setCurrentPutts(newPutts);
    };

    // Handle round completion
    const handleRoundComplete = async (putts: PuttResult[]) => {
        const roundMakes = putts.filter(p => p.result === 'make').length;

        // Save round data
        setSessionData(prev => [...prev, {
            distance: currentDistance,
            putts: putts,
            completed: true,
        }]);

        // Announce summary
        await speechService.speak(`${roundMakes} of ${putterCount} at ${currentDistance} feet`);

        // Check if more distances
        if (currentDistanceIndex < distances.length - 1) {
            setIsTransitioning(true);
            const nextDistance = distances[currentDistanceIndex + 1];
            await speechService.announceDistance(nextDistance);

            // Wait for user to get to next distance
            setTimeout(() => {
                setCurrentDistanceIndex(prev => prev + 1);
                setIsTransitioning(false);
            }, 3000);
        } else {
            // Session complete
            handleSessionEnd();
        }
    };

    // End session
    const handleSessionEnd = async () => {
        const totalMakes = sessionData.reduce(
            (sum, round) => sum + round.putts.filter(p => p.result === 'make').length, 0
        );
        const totalPutts = sessionData.reduce(
            (sum, round) => sum + round.putts.length, 0
        );

        await speechService.speak(`Session complete! ${totalMakes} of ${totalPutts} total.`);

        router.replace({
            pathname: '/session/summary',
            params: { data: JSON.stringify(sessionData) }
        });
    };

    const requestEndSession = () => {
        setShowEndConfirm(true);
        speechService.speak('End session?');
    };

    const confirmEndSession = () => {
        if (currentPutts.some(p => p.result !== 'pending')) {
            setSessionData(prev => [...prev, {
                distance: currentDistance,
                putts: currentPutts,
                completed: false,
            }]);
        }
        handleSessionEnd();
    };

    return (
        <View style={styles.container}>
            {/* FULLSCREEN CAMERA */}
            {permission?.granted && (
                <CameraView style={styles.camera} facing="front" />
            )}

            {/* TOP OVERLAY - Distance & Close */}
            <SafeAreaView style={styles.topOverlay}>
                <View style={styles.topRow}>
                    <View style={styles.distanceChip}>
                        <Text style={styles.distanceNumber}>{currentDistance}</Text>
                        <Text style={styles.distanceUnit}>ft</Text>
                    </View>

                    <View style={styles.progressDots}>
                        {distances.map((d, i) => (
                            <View
                                key={d}
                                style={[
                                    styles.dot,
                                    i <= currentDistanceIndex && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>

                    <IconButton
                        icon="close"
                        iconColor="#ff6b6b"
                        size={28}
                        onPress={requestEndSession}
                        style={styles.closeButton}
                    />
                </View>
            </SafeAreaView>

            {/* BOTTOM OVERLAY - Putts & Buttons */}
            <View style={styles.bottomOverlay}>
                {/* Putt Icons Row */}
                <View style={styles.puttsRow}>
                    {currentPutts.map((putt, index) => (
                        <Pressable
                            key={index}
                            onPress={() => putt.result !== 'pending' && togglePutt(index)}
                            style={[
                                styles.puttIcon,
                                putt.result === 'make' && styles.puttMake,
                                putt.result === 'miss' && styles.puttMiss,
                                putt.result === 'pending' && styles.puttPending,
                            ]}
                        >
                            <Text style={styles.puttText}>
                                {putt.result === 'make' ? '✓' : putt.result === 'miss' ? '✗' : (index + 1)}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.scoreText}>{makes}/{completedPutts} makes</Text>

                {/* Make/Miss Buttons */}
                <View style={styles.buttonsRow}>
                    <Pressable
                        style={[styles.actionButton, styles.makeButton]}
                        onPress={() => recordPutt('make')}
                    >
                        <Text style={styles.buttonEmoji}>👍</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionButton, styles.missButton]}
                        onPress={() => recordPutt('miss')}
                    >
                        <Text style={styles.buttonEmoji}>👎</Text>
                    </Pressable>
                </View>
            </View>

            {/* Transition Overlay */}
            {isTransitioning && (
                <View style={styles.transitionOverlay}>
                    <Text style={styles.transitionEmoji}>🎯</Text>
                    <Text style={styles.transitionText}>
                        Move to {distances[currentDistanceIndex + 1]} ft
                    </Text>
                </View>
            )}

            {/* End Confirmation */}
            {showEndConfirm && (
                <View style={styles.confirmOverlay}>
                    <View style={styles.confirmBox}>
                        <Text style={styles.confirmTitle}>End Session?</Text>
                        <Text style={styles.confirmSubtext}>
                            {sessionData.length} rounds recorded
                        </Text>
                        <View style={styles.confirmButtons}>
                            <Pressable
                                style={styles.confirmCancel}
                                onPress={() => setShowEndConfirm(false)}
                            >
                                <Text style={styles.cancelText}>Continue</Text>
                            </Pressable>
                            <Pressable
                                style={styles.confirmEnd}
                                onPress={confirmEndSession}
                            >
                                <Text style={styles.endText}>End & Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
    },

    // TOP OVERLAY
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    distanceChip: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    distanceNumber: {
        fontSize: 36,
        fontWeight: '800',
        color: '#00ff88',
    },
    distanceUnit: {
        fontSize: 16,
        color: '#00ff88',
        marginLeft: 4,
    },
    progressDots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        backgroundColor: '#00ff88',
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        margin: 0,
    },

    // BOTTOM OVERLAY
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 40,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    puttsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 8,
    },
    puttIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    puttMake: {
        backgroundColor: 'rgba(0,255,136,0.3)',
        borderColor: '#00ff88',
    },
    puttMiss: {
        backgroundColor: 'rgba(255,107,107,0.3)',
        borderColor: '#ff6b6b',
    },
    puttPending: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.3)',
    },
    puttText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scoreText: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 16,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
    },
    actionButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    makeButton: {
        backgroundColor: '#00ff88',
    },
    missButton: {
        backgroundColor: '#ff6b6b',
    },
    buttonEmoji: {
        fontSize: 36,
    },

    // TRANSITIONS
    transitionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transitionEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    transitionText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#00ff88',
    },

    // CONFIRM
    confirmOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmBox: {
        backgroundColor: '#1a1a2e',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
    },
    confirmTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    confirmSubtext: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    confirmCancel: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#888',
    },
    cancelText: {
        color: '#888',
        fontSize: 16,
    },
    confirmEnd: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#ff6b6b',
    },
    endText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
