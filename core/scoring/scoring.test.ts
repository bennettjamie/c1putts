import { calculateStats, PuttResult } from './index';

describe('Scoring Engine', () => {

    it('should handle empty session', () => {
        const stats = calculateStats([]);
        expect(stats.totalPutts).toBe(0);
        expect(stats.makeRate).toBe(0);
        expect(stats.coC).toBe(0);
    });

    it('should calculate perfect session correctly', () => {
        // 5 putts at 10ft, all made.
        const putts: PuttResult[] = Array(5).fill(null).map((_, i) => ({
            distance: 10,
            result: 'make',
            timestamp: Date.now() + i
        }));

        const stats = calculateStats(putts);
        expect(stats.makeRate).toBe(1);
        expect(stats.coC).toBeGreaterThanOrEqual(10);
    });

    it('should identify CoC boundaries', () => {
        // 100% at 10ft, 100% at 15ft, 0% at 20ft
        const putts: PuttResult[] = [
            ...Array(5).fill({ distance: 10, result: 'make' }),
            ...Array(5).fill({ distance: 15, result: 'make' }),
            ...Array(5).fill({ distance: 20, result: 'miss' })
        ].map(p => ({ ...p, timestamp: Date.now() }));

        const stats = calculateStats(putts);

        // The curve smoothing might blur boundaries, but CoC should be approx 15ft
        // (Last point above 90%)
        expect(stats.coC).toBeGreaterThanOrEqual(10);
        expect(stats.coC).toBeLessThan(20);
    });

});
