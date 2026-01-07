import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COC_BADGES, checkCoCBadges } from '../../core/gamification/badges';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 200;

// Distance range for probability curve (5ft to 66ft C2)
const DISTANCES = [5, 10, 15, 20, 25, 30, 33, 40, 50, 66];

interface DistanceStats {
    distance: number;
    makes: number;
    attempts: number;
    percentage: number;
}

interface UserStats {
    distanceStats: DistanceStats[];
    cocDistance: number; // Circle of Confidence (90% threshold)
    totalSessions: number;
    totalPutts: number;
    overallPercentage: number;
}

export default function StatsScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Load from AsyncStorage (or use mock data for now)
            const stored = await AsyncStorage.getItem('c1putts_stats');
            if (stored) {
                setStats(JSON.parse(stored));
            } else {
                // Mock data for demo
                setStats(generateMockStats());
            }
        } catch (e) {
            setStats(generateMockStats());
        } finally {
            setLoading(false);
        }
    };

    const generateMockStats = (): UserStats => {
        // Simulate realistic putting stats (decreases with distance)
        const distanceStats: DistanceStats[] = DISTANCES.map(d => {
            // Probability decreases with distance (roughly)
            const basePct = Math.max(95 - (d - 5) * 2.5, 20);
            const variance = Math.random() * 10 - 5;
            const percentage = Math.round(Math.max(10, Math.min(100, basePct + variance)));
            const attempts = Math.floor(Math.random() * 50) + 10;
            const makes = Math.round(attempts * (percentage / 100));

            return { distance: d, makes, attempts, percentage };
        });

        // Find CoC (first distance below 90%)
        const cocDistance = distanceStats.find(s => s.percentage < 90)?.distance || 33;

        const totalPutts = distanceStats.reduce((sum, s) => sum + s.attempts, 0);
        const totalMakes = distanceStats.reduce((sum, s) => sum + s.makes, 0);

        return {
            distanceStats,
            cocDistance: cocDistance - 2, // CoC is 2ft before drop-off
            totalSessions: 12,
            totalPutts,
            overallPercentage: Math.round((totalMakes / totalPutts) * 100),
        };
    };

    const getCoCBadge = () => {
        if (!stats) return null;
        const badges = checkCoCBadges(stats.cocDistance);
        return badges[badges.length - 1]; // Current badge
    };

    const getNextCoCBadge = () => {
        if (!stats) return null;
        const nextDistance = stats.cocDistance + 2;
        return COC_BADGES.find(b => b.requirement === nextDistance);
    };

    if (loading || !stats) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loading}>Loading stats...</Text>
            </SafeAreaView>
        );
    }

    const currentBadge = getCoCBadge();
    const nextBadge = getNextCoCBadge();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Your Stats</Text>

                {/* Circle of Confidence */}
                <View style={styles.cocCard}>
                    <Text style={styles.cocLabel}>Circle of Confidence</Text>
                    <View style={styles.cocDisplay}>
                        <Text style={styles.cocEmoji}>{currentBadge?.emoji || '🎯'}</Text>
                        <Text style={styles.cocDistance}>{stats.cocDistance} ft</Text>
                        <Text style={styles.cocBadgeName}>{currentBadge?.name || 'Getting Started'}</Text>
                    </View>

                    {nextBadge && (
                        <View style={styles.nextBadge}>
                            <Text style={styles.nextLabel}>Next: {nextBadge.name} ({nextBadge.requirement}ft)</Text>
                            <ProgressBar
                                progress={(stats.cocDistance - (nextBadge.requirement - 2)) / 2}
                                color="#00ff88"
                                style={styles.progressBar}
                            />
                        </View>
                    )}
                </View>

                {/* Probability Curve */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Make Probability by Distance</Text>

                    {/* Simple bar chart */}
                    <View style={styles.chart}>
                        {stats.distanceStats.map((s, i) => (
                            <View key={s.distance} style={styles.barContainer}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${s.percentage}%`,
                                                backgroundColor: s.percentage >= 90 ? '#00ff88' :
                                                    s.percentage >= 70 ? '#f59e0b' : '#ff6b6b'
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{s.distance}</Text>
                                <Text style={styles.barPct}>{s.percentage}%</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#00ff88' }]} />
                            <Text style={styles.legendText}>90%+ (CoC)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                            <Text style={styles.legendText}>70-89%</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
                            <Text style={styles.legendText}>&lt;70%</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalSessions}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalPutts}</Text>
                        <Text style={styles.statLabel}>Total Putts</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.overallPercentage}%</Text>
                        <Text style={styles.statLabel}>Overall</Text>
                    </View>
                </View>

                {/* Challenge Button */}
                <Button
                    mode="contained"
                    onPress={() => router.push('/session/active')}
                    style={styles.challengeButton}
                    buttonColor="#6366f1"
                >
                    Challenge Your CoC at {stats.cocDistance + 2}ft
                </Button>
            </ScrollView>
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
    loading: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
    },

    // CoC Card
    cocCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
    },
    cocLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    cocDisplay: {
        alignItems: 'center',
    },
    cocEmoji: {
        fontSize: 60,
        marginBottom: 8,
    },
    cocDistance: {
        fontSize: 48,
        fontWeight: '800',
        color: '#00ff88',
    },
    cocBadgeName: {
        fontSize: 18,
        color: '#888',
        marginTop: 4,
    },
    nextBadge: {
        marginTop: 20,
        width: '100%',
    },
    nextLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333',
    },

    // Chart
    chartCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 16,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: CHART_HEIGHT,
        alignItems: 'flex-end',
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: CHART_HEIGHT - 40,
        width: '60%',
        backgroundColor: '#333',
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    bar: {
        width: '100%',
        borderRadius: 4,
    },
    barLabel: {
        fontSize: 10,
        color: '#888',
        marginTop: 4,
    },
    barPct: {
        fontSize: 8,
        color: '#666',
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 11,
        color: '#888',
    },

    // Quick Stats
    quickStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },

    challengeButton: {
        borderRadius: 12,
    },
});
