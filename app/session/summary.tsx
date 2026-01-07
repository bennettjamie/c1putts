import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

interface PuttResult {
    index: number;
    result: 'make' | 'miss' | 'pending';
}

interface RoundData {
    distance: number;
    putts: PuttResult[];
    completed: boolean;
}

export default function SessionSummaryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [sessionData, setSessionData] = useState<RoundData[]>([]);

    useEffect(() => {
        if (params.data) {
            try {
                setSessionData(JSON.parse(params.data as string));
            } catch (e) {
                console.error('Failed to parse session data');
            }
        }
    }, [params.data]);

    const totalPutts = sessionData.reduce((sum, r) => sum + r.putts.length, 0);
    const totalMakes = sessionData.reduce(
        (sum, r) => sum + r.putts.filter(p => p.result === 'make').length, 0
    );
    const overallPercentage = totalPutts > 0 ? Math.round((totalMakes / totalPutts) * 100) : 0;

    const handleDone = () => {
        router.replace('/(tabs)');
    };

    const handlePracticeAgain = () => {
        router.replace('/session/active');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Session Complete! 🎉</Text>

                {/* Overall Stats */}
                <View style={styles.overallCard}>
                    <Text style={styles.overallPercentage}>{overallPercentage}%</Text>
                    <Text style={styles.overallLabel}>
                        {totalMakes} of {totalPutts} putts
                    </Text>
                </View>

                {/* Distance Breakdown */}
                <Text style={styles.sectionTitle}>By Distance</Text>
                <View style={styles.distanceList}>
                    {sessionData.map((round, index) => {
                        const makes = round.putts.filter(p => p.result === 'make').length;
                        const total = round.putts.length;
                        const pct = total > 0 ? Math.round((makes / total) * 100) : 0;

                        return (
                            <View key={index} style={styles.distanceRow}>
                                <Text style={styles.distanceLabel}>{round.distance} ft</Text>
                                <View style={styles.distanceBar}>
                                    <View
                                        style={[
                                            styles.distanceBarFill,
                                            { width: `${pct}%` },
                                            pct >= 80 && styles.barGreen,
                                            pct >= 50 && pct < 80 && styles.barYellow,
                                            pct < 50 && styles.barRed,
                                        ]}
                                    />
                                </View>
                                <Text style={styles.distanceStats}>
                                    {makes}/{total} ({pct}%)
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Encouragement */}
                <View style={styles.encouragement}>
                    {overallPercentage >= 80 && (
                        <Text style={styles.encouragementText}>🔥 Excellent session!</Text>
                    )}
                    {overallPercentage >= 60 && overallPercentage < 80 && (
                        <Text style={styles.encouragementText}>💪 Good work! Keep practicing!</Text>
                    )}
                    {overallPercentage < 60 && (
                        <Text style={styles.encouragementText}>📈 Every rep counts! Come back tomorrow!</Text>
                    )}
                </View>

                {/* Contribution note */}
                <View style={styles.contributionNote}>
                    <Text style={styles.contributionText}>
                        ✅ Training data saved for AI model improvement
                    </Text>
                </View>
            </ScrollView>

            {/* Footer buttons */}
            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={handleDone}
                    style={styles.doneButton}
                    textColor="#888"
                >
                    Done
                </Button>
                <Button
                    mode="contained"
                    onPress={handlePracticeAgain}
                    style={styles.againButton}
                    buttonColor="#00ff88"
                    textColor="#0f0f1a"
                >
                    Practice Again
                </Button>
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 24,
    },
    overallCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
    },
    overallPercentage: {
        fontSize: 72,
        fontWeight: '800',
        color: '#00ff88',
    },
    overallLabel: {
        fontSize: 18,
        color: '#888',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 16,
    },
    distanceList: {
        gap: 12,
    },
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    distanceLabel: {
        width: 50,
        fontSize: 14,
        color: '#888',
    },
    distanceBar: {
        flex: 1,
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        overflow: 'hidden',
    },
    distanceBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    barGreen: {
        backgroundColor: '#00ff88',
    },
    barYellow: {
        backgroundColor: '#f59e0b',
    },
    barRed: {
        backgroundColor: '#ff6b6b',
    },
    distanceStats: {
        width: 70,
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    encouragement: {
        marginTop: 30,
        alignItems: 'center',
    },
    encouragementText: {
        fontSize: 18,
        color: 'white',
    },
    contributionNote: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#00ff8815',
        borderRadius: 10,
    },
    contributionText: {
        fontSize: 13,
        color: '#00ff88',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
    },
    doneButton: {
        flex: 1,
        borderColor: '#444',
    },
    againButton: {
        flex: 1,
    },
});
