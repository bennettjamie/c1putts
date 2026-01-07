/**
 * Badge & Gamification System
 * 
 * Tracks user contributions and awards badges for AI training participation.
 */

export interface Badge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    requirement: number; // clips required
    tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface UserContributions {
    totalClips: number;
    totalMakes: number;
    totalMisses: number;
    earnedBadges: string[]; // badge IDs
    contributionStreak: number; // consecutive days
    lastContributionDate: string | null;
}

// Badge definitions
export const CONTRIBUTION_BADGES: Badge[] = [
    {
        id: 'rookie_trainer',
        name: 'Rookie Trainer',
        emoji: '🥉',
        description: 'Contributed 10 training clips',
        requirement: 10,
        tier: 'bronze',
    },
    {
        id: 'data_donor',
        name: 'Data Donor',
        emoji: '🥈',
        description: 'Contributed 50 training clips',
        requirement: 50,
        tier: 'silver',
    },
    {
        id: 'ai_coach',
        name: 'AI Coach',
        emoji: '🥇',
        description: 'Contributed 200 training clips',
        requirement: 200,
        tier: 'gold',
    },
    {
        id: 'founding_trainer',
        name: 'Founding Trainer',
        emoji: '💎',
        description: 'Top 50 beta contributors',
        requirement: 500,
        tier: 'diamond',
    },
];

// Circle of Confidence Badges (C1 = 33ft, C2 = 66ft)
export const COC_BADGES: Badge[] = [
    { id: 'coc_6', name: 'Baby Chains', emoji: '👶', description: 'CoC at 6 ft', requirement: 6, tier: 'bronze' },
    { id: 'coc_8', name: "Lil' Tap-In", emoji: '🎯', description: 'CoC at 8 ft', requirement: 8, tier: 'bronze' },
    { id: 'coc_10', name: 'Warm-Up Warrior', emoji: '🔥', description: 'CoC at 10 ft', requirement: 10, tier: 'bronze' },
    { id: 'coc_12', name: 'Tap-In Terminator', emoji: '💪', description: 'CoC at 12 ft', requirement: 12, tier: 'bronze' },
    { id: 'coc_14', name: 'Circle Cub', emoji: '🐻', description: 'CoC at 14 ft', requirement: 14, tier: 'silver' },
    { id: 'coc_16', name: 'Money Zone 16', emoji: '💰', description: 'CoC at 16 ft', requirement: 16, tier: 'silver' },
    { id: 'coc_18', name: 'Ice Circle 18', emoji: '🧊', description: 'CoC at 18 ft', requirement: 18, tier: 'silver' },
    { id: 'coc_20', name: 'Bulletproof 20', emoji: '🛡️', description: 'CoC at 20 ft', requirement: 20, tier: 'silver' },
    { id: 'coc_22', name: 'Cold-Blooded 22', emoji: '🐍', description: 'CoC at 22 ft', requirement: 22, tier: 'gold' },
    { id: 'coc_24', name: 'Nerves of Steel 24', emoji: '⚔️', description: 'CoC at 24 ft', requirement: 24, tier: 'gold' },
    { id: 'coc_26', name: 'Circle Assassin 26', emoji: '🥷', description: 'CoC at 26 ft', requirement: 26, tier: 'gold' },
    { id: 'coc_28', name: 'Chain Sniper 28', emoji: '🎯', description: 'CoC at 28 ft', requirement: 28, tier: 'gold' },
    { id: 'coc_30', name: 'Edge Dweller 30', emoji: '⚡', description: 'CoC at 30 ft', requirement: 30, tier: 'gold' },
    { id: 'coc_33', name: 'Circle 1 King', emoji: '👑', description: 'CoC at 33 ft (C1 edge)', requirement: 33, tier: 'diamond' },
    { id: 'coc_40', name: 'Deep Circle 40', emoji: '🌊', description: 'CoC at 40 ft', requirement: 40, tier: 'diamond' },
    { id: 'coc_50', name: 'Circle 2 Challenger', emoji: '🚀', description: 'CoC at 50 ft', requirement: 50, tier: 'diamond' },
    { id: 'coc_66', name: 'Long-Bomb Legend', emoji: '💎', description: 'CoC at 66 ft (C2 edge)', requirement: 66, tier: 'diamond' },
];

/**
 * Check which badges a user has earned based on contributions
 */
export function checkEarnedBadges(contributions: UserContributions): Badge[] {
    return CONTRIBUTION_BADGES.filter(
        badge => contributions.totalClips >= badge.requirement
    );
}

/**
 * Check which CoC badges a user has earned based on their CoC distance
 */
export function checkCoCBadges(cocDistance: number): Badge[] {
    return COC_BADGES.filter(badge => cocDistance >= badge.requirement);
}

/**
 * Get the next badge to unlock
 */
export function getNextBadge(contributions: UserContributions): Badge | null {
    const earned = checkEarnedBadges(contributions);
    const earnedIds = new Set(earned.map(b => b.id));

    return CONTRIBUTION_BADGES.find(badge => !earnedIds.has(badge.id)) || null;
}

/**
 * Calculate progress toward next badge
 */
export function getBadgeProgress(contributions: UserContributions): {
    current: number;
    required: number;
    percent: number
} {
    const nextBadge = getNextBadge(contributions);
    if (!nextBadge) {
        return { current: contributions.totalClips, required: contributions.totalClips, percent: 100 };
    }

    const current = contributions.totalClips;
    const required = nextBadge.requirement;
    const percent = Math.round((current / required) * 100);

    return { current, required, percent };
}
