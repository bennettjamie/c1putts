/**
 * Scoring and Statistics Engine
 * 
 * Handles calculating the "Circle of Confidence" using logistic regression
 * on make/miss data across distances.
 */

export interface PuttResult {
    distance: number; // in feet
    result: 'make' | 'miss';
    timestamp: number;
}

export interface ConfidenceStats {
    coC: number; // The distance where probability drops below 90%
    curve: { distance: number; probability: number }[];
    totalPutts: number;
    makeRate: number;
}

/**
 * Calculates the Circle of Confidence stats.
 * Uses a simplified logistic regression or moving average if data is sparse.
 */
export function calculateStats(putts: PuttResult[]): ConfidenceStats {
    if (putts.length === 0) {
        return { coC: 0, curve: [], totalPutts: 0, makeRate: 0 };
    }

    // 1. Basic Stats
    const makes = putts.filter(p => p.result === 'make').length;
    const makeRate = makes / putts.length;

    // 2. Generate Curve (Simplified Moving Average for MVP)
    // TODO: Upgrade to proper Logistic Regression (sigmoid fitting) in v1.1
    const curve = generateCurve(putts);

    // 3. Find CoC (First distance where prob < 0.9)
    let coC = 0;
    for (const point of curve) {
        if (point.probability >= 0.9) {
            coC = point.distance;
        } else {
            break; // Dropped below 90%
        }
    }

    return {
        coC,
        curve,
        totalPutts: putts.length,
        makeRate
    };
}

function generateCurve(putts: PuttResult[]) {
    // Sort by distance
    const sorted = [...putts].sort((a, b) => a.distance - b.distance);
    const maxDist = Math.ceil(sorted[sorted.length - 1].distance);

    const curve: { distance: number; probability: number }[] = [];

    // Bin size window for smoothing (e.g., +/- 3ft)
    const window = 3;

    for (let d = 5; d <= Math.max(30, maxDist + 5); d++) {
        // Get putts in range [d-window, d+window]
        const relevant = putts.filter(p => Math.abs(p.distance - d) <= window);

        if (relevant.length < 3) {
            // Not enough data, assume decay if we have previous, or 1.0 if close
            const prev = curve[curve.length - 1]?.probability ?? (d < 10 ? 1.0 : 0.5);
            curve.push({ distance: d, probability: prev }); // Flatline for now
            continue;
        }

        const localMakes = relevant.filter(p => p.result === 'make').length;
        const prob = localMakes / relevant.length;

        // Simple smoothing with previous point to prevent jagged lines
        const prevProb = curve.length > 0 ? curve[curve.length - 1].probability : 1.0;
        const smoothed = (prob + prevProb * 2) / 3; // Heavily weight consistency

        curve.push({ distance: d, probability: smoothed });
    }

    return curve;
}
