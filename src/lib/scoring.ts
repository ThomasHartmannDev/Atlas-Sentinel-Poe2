import { STRATEGIES, type StrategyName, type ScoringWeights } from './strategies';
import type { ParsedItem } from '../types';

export function calculateScore(item: ParsedItem, inputWeights?: ScoringWeights, strategyName?: string): number {
    if (item.type === 'Unknown') return 0;

    // Robust selection of weights
    let weights = inputWeights;
    const strategy = strategyName || 'Generic';

    if (!weights || (weights as any).quantity === undefined) {
        weights = STRATEGIES[strategy as StrategyName]?.weights || STRATEGIES['Generic'].weights;
    }

    let score = 0;

    // Tier Bonus (Waystones only)
    if (item.type === 'Waystone' && item.tier > 0) {
        if (item.tier >= 15) score += 100; // T15-T16 meta bonus
        else if (item.tier >= 10) score += 50;
    }

    // Base stats
    score += item.stats.itemQuantity * (weights.quantity || 0);
    score += item.stats.itemRarity * (weights.rarity || 0);
    score += item.stats.packSize * (weights.packSize || 0);
    score += (item.stats.gold || 0) * (weights.gold || 0);
    score += (item.stats.delirium || 0) * (weights.delirium || 0);
    score += (item.stats.magicMonsters || 0) * (weights.magicMonsters || 0);
    score += (item.stats.rareMonsters || 0) * (weights.rareMonsters || 0);
    score += (item.stats.expGain || 0) * (weights.expGain || 0);

    // Crucial Mods Bonus
    const stratDef = STRATEGIES[strategy as StrategyName];
    if (stratDef && stratDef.crucialMods) {
        stratDef.crucialMods.forEach(modText => {
            if (item.originalText.toLowerCase().includes(modText.toLowerCase())) {
                score += 150; // Each crucial mod is extremely valuable
            }
        });
    }

    // Tablet specific scoring
    if (item.type === 'Tablet') {
        score += (item.uses || 1) * 10;

        if (strategy && item.subType) {
            // Check for keyword matches (e.g., "Abyss" strategy matching "Abyss" tablet)
            const stratKeywords = strategy.toLowerCase().split(' ');
            const subTypeLower = item.subType.toLowerCase();

            if (stratKeywords.some(kw => kw.length > 3 && subTypeLower.includes(kw))) {
                score += 50;
            }
        }
    }

    // Corruption
    if (item.corrupted) {
        score += (weights.corruptionBonus || 0);
    }

    return Math.floor(score);
}
