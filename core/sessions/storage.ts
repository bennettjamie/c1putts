/**
 * Session Storage Service
 * 
 * Persists session data locally and syncs to Firebase when online.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PuttResult {
    result: 'make' | 'miss';
    timestamp: string;
}

export interface RoundData {
    distance: number;
    putts: PuttResult[];
    makes: number;
    attempts: number;
}

export interface Session {
    id: string;
    playerId: string;
    type: 'training' | 'coc_challenge' | 'head_to_head' | 'daily';
    rounds: RoundData[];
    totalMakes: number;
    totalAttempts: number;
    percentage: number;
    startedAt: string;
    completedAt: string;
    synced: boolean;
}

const SESSIONS_KEY = 'c1putts_sessions';
const MAX_DETAILED_SESSIONS = 30; // Keep 30 days of detailed data

class SessionStorage {
    async saveSession(session: Omit<Session, 'id' | 'synced'>): Promise<Session> {
        const sessions = await this.getSessions();

        const newSession: Session = {
            ...session,
            id: `session_${Date.now()}`,
            synced: false,
        };

        sessions.push(newSession);

        // Prune old detailed data (keep summary for old sessions)
        const prunedSessions = this.pruneOldSessions(sessions);

        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(prunedSessions));

        // Try to sync to Firebase
        this.syncToFirebase(newSession);

        return newSession;
    }

    async getSessions(): Promise<Session[]> {
        try {
            const data = await AsyncStorage.getItem(SESSIONS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error getting sessions:', e);
            return [];
        }
    }

    async getRecentSessions(count: number = 10): Promise<Session[]> {
        const sessions = await this.getSessions();
        return sessions
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, count);
    }

    async getStats(playerId?: string): Promise<{
        totalSessions: number;
        totalPutts: number;
        totalMakes: number;
        overallPercentage: number;
        cocDistance: number;
        byDistance: { [distance: number]: { makes: number; attempts: number; percentage: number } };
    }> {
        const sessions = await this.getSessions();
        const filtered = playerId
            ? sessions.filter(s => s.playerId === playerId)
            : sessions;

        const byDistance: { [distance: number]: { makes: number; attempts: number } } = {};
        let totalMakes = 0;
        let totalAttempts = 0;

        filtered.forEach(session => {
            session.rounds.forEach(round => {
                if (!byDistance[round.distance]) {
                    byDistance[round.distance] = { makes: 0, attempts: 0 };
                }
                byDistance[round.distance].makes += round.makes;
                byDistance[round.distance].attempts += round.attempts;
                totalMakes += round.makes;
                totalAttempts += round.attempts;
            });
        });

        // Calculate percentages and CoC
        const byDistanceWithPct: { [distance: number]: { makes: number; attempts: number; percentage: number } } = {};
        let cocDistance = 0;

        Object.keys(byDistance)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach(distance => {
                const data = byDistance[distance];
                const pct = data.attempts > 0 ? Math.round((data.makes / data.attempts) * 100) : 0;
                byDistanceWithPct[distance] = { ...data, percentage: pct };

                // CoC = furthest distance with 90%+ and 50+ attempts
                if (pct >= 90 && data.attempts >= 50) {
                    cocDistance = Math.max(cocDistance, distance);
                }
            });

        return {
            totalSessions: filtered.length,
            totalPutts: totalAttempts,
            totalMakes,
            overallPercentage: totalAttempts > 0 ? Math.round((totalMakes / totalAttempts) * 100) : 0,
            cocDistance,
            byDistance: byDistanceWithPct,
        };
    }

    private pruneOldSessions(sessions: Session[]): Session[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - MAX_DETAILED_SESSIONS);

        return sessions.map(session => {
            const sessionDate = new Date(session.completedAt);
            if (sessionDate < cutoff) {
                // Keep summary, remove detailed putt data
                return {
                    ...session,
                    rounds: session.rounds.map(r => ({
                        ...r,
                        putts: [], // Clear detailed putt data
                    })),
                };
            }
            return session;
        });
    }

    private async syncToFirebase(session: Session): Promise<void> {
        // TODO: Implement Firebase sync
        // For now, just mark as synced after a delay (simulating network)
        console.log('📤 Would sync session to Firebase:', session.id);
    }
}

export const sessionStorage = new SessionStorage();
