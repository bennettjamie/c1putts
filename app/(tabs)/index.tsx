import { View, ScrollView, StyleSheet, Pressable, Share } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sessionStorage } from '../../core/sessions';
import { playerDatabase } from '../../core/players';
import { colors, spacing, borderRadius } from '../../core/theme';

export default function Home() {
    const [stats, setStats] = useState({
        cocDistance: 0,
        totalSessions: 0,
        totalPutts: 0,
        overallPercentage: 0,
    });
    const [recentSessions, setRecentSessions] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await sessionStorage.getStats();
        setStats({
            cocDistance: s.cocDistance || 15,
            totalSessions: s.totalSessions,
            totalPutts: s.totalPutts,
            overallPercentage: s.overallPercentage,
        });

        const recent = await sessionStorage.getRecentSessions(3);
        setRecentSessions(recent);
    };

    const handleQuickStart = () => {
        router.push('/session/active');
    };

    const handleDailyChallenge = () => {
        // TODO: Navigate to daily challenge
        router.push('/session/active');
    };

    const handleCoCChallenge = () => {
        const nextDistance = stats.cocDistance + 2;
        router.push({
            pathname: '/session/active',
            params: { mode: 'coc', distance: nextDistance }
        });
    };

    const handleChallengeFriend = async () => {
        try {
            const player = await playerDatabase.getCurrentPlayer();
            const link = player
                ? playerDatabase.generateInviteLink(player.id)
                : 'https://c1putts.app/invite';

            await Share.share({
                message: `🎯 I challenge you to a putting battle! Download C1Putts and beat my score! ${link}`,
                title: 'Challenge a Friend',
            });
        } catch (e) {
            console.error('Share error:', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Ready to putt?</Text>
                    <View style={styles.cocBadge}>
                        <Text style={styles.cocValue}>{stats.cocDistance}ft</Text>
                        <Text style={styles.cocLabel}>CoC</Text>
                    </View>
                </View>

                {/* Quick Start - PRIMARY CTA */}
                <Pressable style={styles.quickStart} onPress={handleQuickStart}>
                    <View style={styles.quickStartIcon}>
                        <MaterialCommunityIcons name="play" size={40} color="#0f0f1a" />
                    </View>
                    <View style={styles.quickStartText}>
                        <Text style={styles.quickStartTitle}>Quick Start</Text>
                        <Text style={styles.quickStartSubtitle}>Training Ladder</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={30} color="#00ff88" />
                </Pressable>

                {/* Challenge Row */}
                <View style={styles.challengeRow}>
                    <Pressable style={styles.challengeCard} onPress={handleDailyChallenge}>
                        <Text style={styles.challengeEmoji}>📅</Text>
                        <Text style={styles.challengeTitle}>Daily</Text>
                        <Text style={styles.challengeSubtitle}>Challenge</Text>
                    </Pressable>

                    <Pressable style={styles.challengeCard} onPress={handleCoCChallenge}>
                        <Text style={styles.challengeEmoji}>🎯</Text>
                        <Text style={styles.challengeTitle}>{stats.cocDistance + 2}ft</Text>
                        <Text style={styles.challengeSubtitle}>Expand CoC</Text>
                    </Pressable>

                    <Pressable style={styles.challengeCard} onPress={handleChallengeFriend}>
                        <Text style={styles.challengeEmoji}>👥</Text>
                        <Text style={styles.challengeTitle}>Friend</Text>
                        <Text style={styles.challengeSubtitle}>Challenge</Text>
                    </Pressable>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalSessions}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalPutts}</Text>
                        <Text style={styles.statLabel}>Putts</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.overallPercentage}%</Text>
                        <Text style={styles.statLabel}>Make %</Text>
                    </View>
                </View>

                {/* Recent Sessions */}
                {recentSessions.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Recent Sessions</Text>
                        {recentSessions.map((session, i) => (
                            <Card key={i} style={styles.sessionCard}>
                                <View style={styles.sessionRow}>
                                    <View>
                                        <Text style={styles.sessionType}>
                                            {session.type === 'training' ? 'Training' : 'Challenge'}
                                        </Text>
                                        <Text style={styles.sessionDate}>
                                            {new Date(session.completedAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.sessionStats}>
                                        <Text style={styles.sessionPct}>{session.percentage}%</Text>
                                        <Text style={styles.sessionPutts}>{session.totalAttempts} putts</Text>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </>
                )}

                {/* Training Reminder */}
                <View style={styles.trainingTip}>
                    <MaterialCommunityIcons name="lightbulb-on" size={20} color="#f59e0b" />
                    <Text style={styles.tipText}>
                        Your sessions help train our AI. Keep putting!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    greeting: {
        fontSize: 28,
        fontFamily: 'Inter-Bold',
        color: colors.textPrimary,
    },
    cocBadge: {
        backgroundColor: `${colors.brand}20`,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
    },
    cocValue: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-Bold',
        color: colors.brand,
    },
    cocLabel: {
        fontSize: 10,
        color: colors.brand,
    },

    // Quick Start
    quickStart: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brand,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    quickStartIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    quickStartText: {
        flex: 1,
    },
    quickStartTitle: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        color: colors.textOnBrand,
    },
    quickStartSubtitle: {
        fontSize: 14,
        color: colors.textOnBrand,
        opacity: 0.7,
    },

    // Challenge Row
    challengeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    challengeCard: {
        flex: 1,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    challengeEmoji: {
        fontSize: 28,
        marginBottom: spacing.sm,
    },
    challengeTitle: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: colors.textPrimary,
    },
    challengeSubtitle: {
        fontSize: 11,
        color: colors.textMuted,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: 'JetBrainsMono-Bold',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    // Sessions
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    sessionCard: {
        backgroundColor: colors.surfaceSolid,
        marginBottom: spacing.sm,
        borderRadius: borderRadius.md,
    },
    sessionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    sessionType: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: colors.textPrimary,
    },
    sessionDate: {
        fontSize: 12,
        color: colors.textMuted,
    },
    sessionStats: {
        alignItems: 'flex-end',
    },
    sessionPct: {
        fontSize: 18,
        fontFamily: 'JetBrainsMono-Bold',
        color: colors.success,
    },
    sessionPutts: {
        fontSize: 11,
        color: colors.textMuted,
    },

    // Training tip
    trainingTip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.warning}15`,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        color: colors.warning,
    },
});
