import type { ParsedItem } from '../types';
import { calculateItemBaseScore, calculateSetScore } from './scoring';

export interface OptimizedSet {
    waystone: ParsedItem;
    tablets: ParsedItem[];
    totalScore: number;
}

export const findBestSets = (items: ParsedItem[], activeStrategy: string): OptimizedSet[] => {
    const waystones = items.filter(i => i.type === 'Waystone');
    const tablets = items.filter(i => i.type === 'Tablet');

    if (waystones.length === 0 || tablets.length < 3) return [];

    const sets: OptimizedSet[] = [];

    // Calculate base scores for preliminary sorting
    const scoredTablets = tablets.map(t => ({
        ...t,
        baseScore: calculateItemBaseScore(t, activeStrategy)
    })).sort((a, b) => {
        const diff = b.baseScore - a.baseScore;
        if (diff !== 0) return diff;
        return a.id.localeCompare(b.id);
    });

    // Strategy requires 3 tablets. 
    // To keep it performant but allow for synergy, we'll look at the top 10 tablets 
    // and find the best combination of 3 for each waystone.
    const candidateTablets = scoredTablets.slice(0, 10);
    if (candidateTablets.length < 3) return [];

    const scoredWaystones = waystones.map(w => ({
        ...w,
        baseScore: calculateItemBaseScore(w, activeStrategy)
    }));

    // For each waystone, find the best combination of 3 from the top 10
    for (const w of scoredWaystones) {
        let bestCombination: ParsedItem[] = [];
        let bestSetScore = -1;

        // Triple loop for combinations (C(10,3) = 120, which is fine)
        for (let i = 0; i < candidateTablets.length; i++) {
            for (let j = i + 1; j < candidateTablets.length; j++) {
                for (let k = j + 1; k < candidateTablets.length; k++) {
                    const combo = [candidateTablets[i], candidateTablets[j], candidateTablets[k]];
                    const score = calculateSetScore(w, combo, activeStrategy);

                    if (score > bestSetScore) {
                        bestSetScore = score;
                        bestCombination = combo;
                    }
                }
            }
        }

        if (bestCombination.length === 3) {
            sets.push({
                waystone: w,
                tablets: bestCombination,
                totalScore: bestSetScore
            });
        }
    }

    // Sort by total score and get top 5
    return sets.sort((a, b) => {
        const diff = b.totalScore - a.totalScore;
        if (diff !== 0) return diff;
        return a.waystone.id.localeCompare(b.waystone.id);
    }).slice(0, 5);
};
