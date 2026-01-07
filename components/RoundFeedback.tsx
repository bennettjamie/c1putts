import { View, StyleSheet, Modal } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { speechService } from '../../services/speech';

interface RoundFeedbackProps {
    visible: boolean;
    makes: number;
    misses: number;
    expectedCount: number;
    currentDistance: number;
    nextDistance: number | null;
    onAddMake: () => void;
    onAddMiss: () => void;
    onContinue: () => void;
    onEndSession: () => void;
}

export function RoundFeedback({
    visible,
    makes,
    misses,
    expectedCount,
    currentDistance,
    nextDistance,
    onAddMake,
    onAddMiss,
    onContinue,
    onEndSession,
}: RoundFeedbackProps) {
    const total = makes + misses;
    const isMismatch = total !== expectedCount;
    const percent = total > 0 ? Math.round((makes / total) * 100) : 0;

    useEffect(() => {
        if (visible) {
            speechService.playRoundComplete(makes, total);
        }
    }, [visible, makes, total]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Header */}
                    <Text style={styles.title}>🎉 Round Complete!</Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{makes}</Text>
                            <Text style={styles.statLabel}>Makes</Text>
                        </View>
                        <View style={styles.statDivider}>
                            <Text style={styles.percentText}>{percent}%</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{misses}</Text>
                            <Text style={styles.statLabel}>Misses</Text>
                        </View>
                    </View>

                    {/* Distance info */}
                    <Text style={styles.distanceText}>At {currentDistance} feet</Text>

                    {/* Mismatch warning */}
                    {isMismatch && (
                        <View style={styles.mismatchBox}>
                            <Text style={styles.mismatchTitle}>
                                🤔 Did we miss one?
                            </Text>
                            <Text style={styles.mismatchText}>
                                Expected {expectedCount} putts, recorded {total}
                            </Text>
                            <View style={styles.mismatchButtons}>
                                <Button
                                    mode="outlined"
                                    onPress={onAddMake}
                                    style={styles.mismatchButton}
                                    labelStyle={styles.mismatchButtonLabel}
                                    icon="plus"
                                >
                                    Add Make
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={onAddMiss}
                                    style={styles.mismatchButton}
                                    labelStyle={styles.mismatchButtonLabel}
                                    icon="plus"
                                >
                                    Add Miss
                                </Button>
                            </View>
                        </View>
                    )}

                    {/* Perfect match */}
                    {!isMismatch && (
                        <View style={styles.perfectBox}>
                            <Text style={styles.perfectText}>
                                ✓ All {expectedCount} putts recorded!
                            </Text>
                        </View>
                    )}

                    {/* Next distance or end */}
                    <View style={styles.footer}>
                        {nextDistance ? (
                            <Button
                                mode="contained"
                                onPress={onContinue}
                                style={styles.continueButton}
                                labelStyle={styles.continueButtonLabel}
                            >
                                Move to {nextDistance} feet →
                            </Button>
                        ) : (
                            <Button
                                mode="contained"
                                onPress={onEndSession}
                                style={styles.endButton}
                                labelStyle={styles.endButtonLabel}
                            >
                                Finish Session 🏆
                            </Button>
                        )}

                        {nextDistance && (
                            <Button
                                mode="text"
                                onPress={onEndSession}
                                textColor="#aaa"
                            >
                                End Session Early
                            </Button>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        backgroundColor: '#1a1a2e',
        borderRadius: 24,
        padding: 30,
        width: '100%',
        maxWidth: 380,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    statBox: {
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    statValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00ff88',
    },
    statLabel: {
        fontSize: 14,
        color: '#888',
    },
    statDivider: {
        paddingHorizontal: 15,
    },
    percentText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    distanceText: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 20,
    },
    mismatchBox: {
        backgroundColor: '#ff6b6b22',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ff6b6b',
    },
    mismatchTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: 5,
    },
    mismatchText: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 15,
    },
    mismatchButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    mismatchButton: {
        flex: 1,
        borderColor: '#666',
    },
    mismatchButtonLabel: {
        fontSize: 12,
    },
    perfectBox: {
        backgroundColor: '#00ff8822',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    perfectText: {
        fontSize: 16,
        color: '#00ff88',
        textAlign: 'center',
    },
    footer: {
        gap: 10,
    },
    continueButton: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingVertical: 6,
    },
    continueButtonLabel: {
        color: '#1a1a2e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    endButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        paddingVertical: 6,
    },
    endButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
