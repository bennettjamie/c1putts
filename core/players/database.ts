/**
 * Player & Friend Database
 * 
 * Manages player profiles, friends, and challenges.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Player {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
    useMetric?: boolean;
    dominantHand: 'right' | 'left' | 'ambidextrous';
    shirtColor?: string;
    isCurrentUser: boolean;
    createdAt: string;
    lastPlayed?: string;
}

export interface PlayerStats {
    playerId: string;
    cocDistance: number;
    totalSessions: number;
    totalPutts: number;
    totalMakes: number;
    byDistance: { [distance: number]: { makes: number; attempts: number } };
}

export interface Friend {
    playerId: string;
    player: Player;
    status: 'pending' | 'accepted';
    addedAt: string;
    challengeCount: number;
    wins: number;
    losses: number;
}

export interface Challenge {
    id: string;
    type: 'coc' | 'head_to_head' | 'daily';
    status: 'pending' | 'active' | 'completed';
    createdBy: string;
    opponent?: string;
    distance?: number;
    puttsRequired: number;
    results?: {
        [playerId: string]: { makes: number; attempts: number };
    };
    createdAt: string;
    completedAt?: string;
}

// Storage keys
const KEYS = {
    CURRENT_PLAYER: 'c1putts_current_player',
    FRIENDS: 'c1putts_friends',
    CHALLENGES: 'c1putts_challenges',
    SESSIONS: 'c1putts_sessions',
};

class PlayerDatabase {
    // Current player
    async getCurrentPlayer(): Promise<Player | null> {
        try {
            const data = await AsyncStorage.getItem(KEYS.CURRENT_PLAYER);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error getting current player:', e);
            return null;
        }
    }

    async saveCurrentPlayer(player: Player): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.CURRENT_PLAYER, JSON.stringify(player));
        } catch (e) {
            console.error('Error saving current player:', e);
        }
    }

    async createCurrentPlayer(name: string): Promise<Player> {
        const player: Player = {
            id: `player_${Date.now()}`,
            name,
            dominantHand: 'right',
            isCurrentUser: true,
            createdAt: new Date().toISOString(),
        };
        await this.saveCurrentPlayer(player);
        return player;
    }

    // Friends
    async getFriends(): Promise<Friend[]> {
        try {
            const data = await AsyncStorage.getItem(KEYS.FRIENDS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error getting friends:', e);
            return [];
        }
    }

    async addFriend(player: Player): Promise<Friend> {
        const friends = await this.getFriends();
        const friend: Friend = {
            playerId: player.id,
            player,
            status: 'pending',
            addedAt: new Date().toISOString(),
            challengeCount: 0,
            wins: 0,
            losses: 0,
        };
        friends.push(friend);
        await AsyncStorage.setItem(KEYS.FRIENDS, JSON.stringify(friends));
        return friend;
    }

    async acceptFriend(playerId: string): Promise<void> {
        const friends = await this.getFriends();
        const friend = friends.find(f => f.playerId === playerId);
        if (friend) {
            friend.status = 'accepted';
            await AsyncStorage.setItem(KEYS.FRIENDS, JSON.stringify(friends));
        }
    }

    // Challenges
    async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
        const challenges = await this.getChallenges();
        const newChallenge: Challenge = {
            ...challenge,
            id: `challenge_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        challenges.push(newChallenge);
        await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
        return newChallenge;
    }

    async getChallenges(): Promise<Challenge[]> {
        try {
            const data = await AsyncStorage.getItem(KEYS.CHALLENGES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error getting challenges:', e);
            return [];
        }
    }

    async getPendingChallenges(): Promise<Challenge[]> {
        const challenges = await this.getChallenges();
        return challenges.filter(c => c.status === 'pending' || c.status === 'active');
    }

    // Invite link generation
    generateInviteLink(currentPlayerId: string): string {
        // In production, this would be a deep link
        const code = Buffer.from(currentPlayerId).toString('base64').substring(0, 8);
        return `c1putts://invite/${code}`;
    }

    generateChallengeLink(challengeId: string): string {
        return `c1putts://challenge/${challengeId}`;
    }
}

export const playerDatabase = new PlayerDatabase();
