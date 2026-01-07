/**
 * Contribution Tracking Service
 * 
 * Tracks user contributions locally and syncs with Firestore.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { UserContributions, checkEarnedBadges, Badge } from './badges';

const LOCAL_KEY = '@c100_contributions';

class ContributionTracker {
    private contributions: UserContributions = {
        totalClips: 0,
        totalMakes: 0,
        totalMisses: 0,
        earnedBadges: [],
        contributionStreak: 0,
        lastContributionDate: null,
    };

    private userId: string | null = null;

    async initialize(userId: string) {
        this.userId = userId;

        // Load local data first (for offline support)
        await this.loadLocal();

        // Then sync with server if online
        await this.syncFromServer();
    }

    private async loadLocal() {
        try {
            const stored = await AsyncStorage.getItem(LOCAL_KEY);
            if (stored) {
                this.contributions = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load contributions:', error);
        }
    }

    private async saveLocal() {
        try {
            await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(this.contributions));
        } catch (error) {
            console.error('Failed to save contributions:', error);
        }
    }

    private async syncFromServer() {
        if (!this.userId) return;

        try {
            const docRef = doc(db, 'user_contributions', this.userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const serverData = docSnap.data() as UserContributions;
                // Merge with local (take higher values)
                this.contributions = {
                    totalClips: Math.max(this.contributions.totalClips, serverData.totalClips || 0),
                    totalMakes: Math.max(this.contributions.totalMakes, serverData.totalMakes || 0),
                    totalMisses: Math.max(this.contributions.totalMisses, serverData.totalMisses || 0),
                    earnedBadges: [...new Set([...this.contributions.earnedBadges, ...(serverData.earnedBadges || [])])],
                    contributionStreak: Math.max(this.contributions.contributionStreak, serverData.contributionStreak || 0),
                    lastContributionDate: serverData.lastContributionDate || this.contributions.lastContributionDate,
                };
                await this.saveLocal();
            }
        } catch (error) {
            console.error('Failed to sync contributions:', error);
        }
    }

    async recordContribution(result: 'make' | 'miss'): Promise<Badge[]> {
        // Update local
        this.contributions.totalClips++;
        if (result === 'make') {
            this.contributions.totalMakes++;
        } else {
            this.contributions.totalMisses++;
        }

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        if (this.contributions.lastContributionDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (this.contributions.lastContributionDate === yesterday) {
                this.contributions.contributionStreak++;
            } else {
                this.contributions.contributionStreak = 1;
            }
            this.contributions.lastContributionDate = today;
        }

        await this.saveLocal();

        // Check for new badges
        const earnedBadges = checkEarnedBadges(this.contributions);
        const newBadges = earnedBadges.filter(
            b => !this.contributions.earnedBadges.includes(b.id)
        );

        if (newBadges.length > 0) {
            this.contributions.earnedBadges.push(...newBadges.map(b => b.id));
            await this.saveLocal();
        }

        // Sync to server (fire and forget)
        this.syncToServer();

        return newBadges;
    }

    private async syncToServer() {
        if (!this.userId) return;

        try {
            const docRef = doc(db, 'user_contributions', this.userId);
            await setDoc(docRef, this.contributions, { merge: true });
        } catch (error) {
            console.error('Failed to sync to server:', error);
        }
    }

    getContributions(): UserContributions {
        return { ...this.contributions };
    }

    async reset() {
        this.contributions = {
            totalClips: 0,
            totalMakes: 0,
            totalMisses: 0,
            earnedBadges: [],
            contributionStreak: 0,
            lastContributionDate: null,
        };
        await this.saveLocal();
    }
}

export const contributionTracker = new ContributionTracker();
