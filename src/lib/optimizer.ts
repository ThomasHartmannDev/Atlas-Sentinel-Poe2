import type { ParsedItem } from '../types';
import type { ScoringWeights } from './strategies';
import { STRATEGIES } from './strategies';

export interface OptimizedSet {
    waystone: ParsedItem;
    tablets: ParsedItem[];
    totalScore: number;
}

export const findBestSets = (items: ParsedItem[], weights: ScoringWeights): OptimizedSet[] => {
    const waystones = items.filter(i => i.type === 'Waystone');
    const tablets = items.filter(i => i.type === 'Tablet'); // || i.type === 'Precursor'

    if (waystones.length === 0 || tablets.length < 3) return [];

    const sets: OptimizedSet[] = [];

    // Naive approach: For each waystone, find the 3 highest scoring tablets (based on current weights)
    // First, score all tablets with current weights
    const strategy = Object.values(STRATEGIES).find(s => s.weights === weights);
    const synergyStats = strategy?.synergyStats || [];

    const scoredTablets = tablets.map(t => ({
        ...t,
        currentScore: scoreItem(t, weights, synergyStats)
    })).sort((a, b) => b.currentScore - a.currentScore);

    // Take top 3 tablets generally? No, we might want to pair specific tablets.
    // Requirement: "Best 1 Waystone + 3 Tablets".
    // For MVP: We assume tablets have intrinsic value based on stats.

    const top3Tablets = scoredTablets.slice(0, 3);
    if (top3Tablets.length < 3) return [];

    const tabletScoreSum = top3Tablets.reduce((sum, t) => sum + t.currentScore, 0);

    // Score waystones
    const scoredWaystones = waystones.map(w => ({
        ...w,
        currentScore: scoreItem(w, weights, synergyStats)
    }));

    // Create sets
    for (const w of scoredWaystones) {
        sets.push({
            waystone: w,
            tablets: top3Tablets,
            totalScore: w.currentScore + tabletScoreSum
        });
    }

    // Sort by total score and top 5
    return sets.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
};

// Helper duplication of scoring if not easily imported from worker/scoring.ts
// Ideally we refactor scoring.ts to be usable here.
function scoreItem(item: ParsedItem, weights: ScoringWeights, synergyStats: string[] = []): number {
    let score = 0;
    const s = item.stats;

    // Synergy multiplier: Stats focused by the strategy get a 1.5x weight bonus
    const getWeight = (key: keyof ScoringWeights, statName: string) => {
        const base = weights[key];
        return synergyStats.includes(statName) ? base * 1.5 : base;
    };

    score += s.itemQuantity * getWeight('quantity', 'itemQuantity');
    score += s.itemRarity * getWeight('rarity', 'itemRarity');
    score += s.packSize * getWeight('packSize', 'packSize');
    score += (s.gold || 0) * getWeight('gold', 'gold');
    score += (s.delirium || 0) * getWeight('delirium', 'delirium');

    if (item.corrupted) score += weights.corruptionBonus;
    return score;
}
