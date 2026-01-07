import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, Card, ProgressBar, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import {
    Badge,
    UserContributions,
    checkEarnedBadges,
    getNextBadge,
    getBadgeProgress,
    CONTRIBUTION_BADGES,
    COC_BADGES,
} from '../core/gamification';

interface BadgeDisplayProps {
    contributions: UserContributions;
    cocDistance?: number;
}

/**
 * Displays user's earned badges and progress toward next badge
 */
export function BadgeDisplay({ contributions, cocDistance = 0 }: BadgeDisplayProps) {
    const earnedBadges = checkEarnedBadges(contributions);
    const nextBadge = getNextBadge(contributions);
    const progress = getBadgeProgress(contributions);

    return (
        <Card style={styles.card}>
            <Card.Title title="🏆 Your Badges" />
            <Card.Content>
                {/* Earned Badges */}
                <View style={styles.badgeGrid}>
                    {earnedBadges.map(badge => (
                        <View key={badge.id} style={styles.badgeItem}>
                            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                        </View>
                    ))}
                    {earnedBadges.length === 0 && (
                        <Text style={styles.noBadges}>No badges yet. Keep training!</Text>
                    )}
                </View>

                {/* Progress to next badge */}
                {nextBadge && (
                    <View style={styles.progressSection}>
                        <Text style={styles.progressLabel}>
                            Next: {nextBadge.emoji} {nextBadge.name}
                        </Text>
                        <ProgressBar
                            progress={progress.percent / 100}
                            style={styles.progressBar}
                        />
                        <Text style={styles.progressText}>
                            {progress.current} / {progress.required} clips
                        </Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );
}

interface BadgeUnlockedModalProps {
    badge: Badge | null;
    onDismiss: () => void;
}

/**
 * Celebration modal when a badge is unlocked
 */
export function BadgeUnlockedModal({ badge, onDismiss }: BadgeUnlockedModalProps) {
    if (!badge) return null;

    return (
        <Modal
            visible={!!badge}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalEmoji}>{badge.emoji}</Text>
                    <Text style={styles.modalTitle}>Badge Unlocked!</Text>
                    <Text style={styles.modalBadgeName}>{badge.name}</Text>
                    <Text style={styles.modalDescription}>{badge.description}</Text>

                    <Button mode="contained" onPress={onDismiss} style={styles.modalButton}>
                        Awesome!
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

interface ContributionStatsProps {
    contributions: UserContributions;
}

/**
 * Shows contribution statistics
 */
export function ContributionStats({ contributions }: ContributionStatsProps) {
    const makeRate = contributions.totalClips > 0
        ? Math.round((contributions.totalMakes / contributions.totalClips) * 100)
        : 0;

    return (
        <Card style={styles.card}>
            <Card.Title title="📊 Your Contributions" />
            <Card.Content>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{contributions.totalClips}</Text>
                        <Text style={styles.statLabel}>Total Clips</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{makeRate}%</Text>
                        <Text style={styles.statLabel}>Make Rate</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{contributions.contributionStreak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
    },
    badgeItem: {
        alignItems: 'center',
        width: 80,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    badgeEmoji: {
        fontSize: 32,
    },
    badgeName: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    noBadges: {
        color: '#999',
        fontStyle: 'italic',
    },
    progressSection: {
        marginTop: 20,
    },
    progressLabel: {
        marginBottom: 8,
        fontWeight: '500',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    progressText: {
        marginTop: 4,
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200EE',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
    },
    modalEmoji: {
        fontSize: 64,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    modalBadgeName: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    modalButton: {
        marginTop: 20,
    },
});
