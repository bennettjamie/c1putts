/**
 * Unit Conversion Utility
 * 
 * Handles conversion between feet and meters for distance display.
 */

export type DistanceUnit = 'feet' | 'meters';

// Key distances in feet
export const DISTANCES = {
    C1_FEET: 33,
    C1_METERS: 10,
    C2_FEET: 66,
    C2_METERS: 20,
};

// Training ladder distances
export const TRAINING_LADDER = {
    feet: [5, 10, 15, 20, 25, 33], // Imperial
    meters: [2, 4, 6, 8, 10],      // Metric
};

/**
 * Convert feet to meters
 */
export function feetToMeters(feet: number): number {
    return Math.round((feet * 0.3048) * 10) / 10;
}

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number): number {
    return Math.round((meters / 0.3048) * 10) / 10;
}

/**
 * Format distance with unit
 */
export function formatDistance(
    value: number,
    unit: DistanceUnit,
    showBoth: boolean = false
): string {
    if (unit === 'feet') {
        const ft = `${value} ft`;
        if (showBoth) {
            return `${ft} / ${feetToMeters(value)}M`;
        }
        return ft;
    } else {
        const m = `${value}M`;
        if (showBoth) {
            return `${m} / ${metersToFeet(value)} ft`;
        }
        return m;
    }
}

/**
 * Get training ladder based on unit preference
 */
export function getTrainingLadder(unit: DistanceUnit): number[] {
    return unit === 'feet' ? TRAINING_LADDER.feet : TRAINING_LADDER.meters;
}

/**
 * Check if distance is C1 (Circle 1)
 */
export function isC1(distance: number, unit: DistanceUnit): boolean {
    if (unit === 'feet') {
        return distance <= DISTANCES.C1_FEET;
    }
    return distance <= DISTANCES.C1_METERS;
}

/**
 * Check if distance is C2 (Circle 2)
 */
export function isC2(distance: number, unit: DistanceUnit): boolean {
    if (unit === 'feet') {
        return distance <= DISTANCES.C2_FEET;
    }
    return distance <= DISTANCES.C2_METERS;
}
