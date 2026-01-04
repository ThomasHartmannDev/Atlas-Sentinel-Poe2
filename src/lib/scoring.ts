import { STRATEGIES, type StrategyName, PRECURSOR_TABLETS } from './strategies';
import type { ParsedItem } from '../types';
import { POE2_MODS_DATABASE } from './mods_database';

export function calculateScore(item: ParsedItem, strategyName?: string): number {
    return calculateItemBaseScore(item, strategyName);
}

// 1. Calculate Base individual score (no set-wide synergy)
export function calculateItemBaseScore(item: ParsedItem, strategyName?: string): number {
    if (item.type === 'Unknown') return 0;

    const strategyId = strategyName || 'Generic';
    const stratDef = STRATEGIES[strategyId as StrategyName];

    let score = 0;

    // A. Tier Bonus (Waystones only)
    if (item.type === 'Waystone' && item.tier > 0) {
        if (item.tier >= 15) score += 100;
        else if (item.tier >= 10) score += 50;
    }

    // B. Tag-Driven Numerical Stats
    const tagWeights = stratDef?.tagWeights || { efficiency: 1.0 };

    const efficiencyWeight = tagWeights['efficiency'] || 1.0;
    score += item.stats.itemQuantity * (5 * efficiencyWeight);
    score += item.stats.packSize * (8 * efficiencyWeight);

    const rarityWeight = tagWeights['rarity'] || 1.0;
    score += item.stats.itemRarity * (5 * rarityWeight);

    const goldWeight = tagWeights['gold'] || 1.0;
    score += (item.stats.gold || 0) * (3 * goldWeight);

    const xpWeight = tagWeights['xp'] || 1.0;
    score += (item.stats.expGain || 0) * (10 * xpWeight);
    score += (item.stats.magicMonsters || 0) * (5 * xpWeight);
    score += (item.stats.rareMonsters || 0) * (8 * xpWeight);

    // C. Mod Detection
    POE2_MODS_DATABASE.forEach(modDef => {
        if (item.originalText.toLowerCase().includes(modDef.text.toLowerCase())) {
            let modValue = modDef.baseValue;
            modDef.tags.forEach(tag => {
                const weight = tagWeights[tag] || 1.0;
                modValue *= weight;
            });
            score += modValue;
        }
    });

    // D. Corruption
    if (item.corrupted) score += 20;

    return Math.floor(score);
}

// 2. Calculate the total score for a complete set (Set Synergy Juicing 2.0)
export function calculateSetScore(waystone: ParsedItem, tablets: ParsedItem[], strategyName: string): number {
    const stratDef = STRATEGIES[strategyName as StrategyName];
    if (!stratDef) return 0;

    let totalScore = calculateItemBaseScore(waystone, strategyName);
    tablets.forEach(t => {
        totalScore += calculateItemBaseScore(t, strategyName);
    });

    // --- Synergy Logic ---
    let totalSynergyMultiplier = 1.0;

    // A. Tag Synergy (Waystone + Combined Tablets)
    const waystoneTags = getItemTags(waystone);
    const combinedTabletTags = tablets.flatMap(t => getItemTags(t));
    const uniqueTabletTags = Array.from(new Set(combinedTabletTags));

    waystoneTags.forEach(tag => {
        if (uniqueTabletTags.includes(tag)) {
            // Synergy match!
            totalSynergyMultiplier *= (stratDef.synergyMultiplier || 1.2);
        }
    });

    // B. Meta Subjectivity (Loyalty vs Mix Master)
    const tabletLeagues = tablets.map(t => getLeagueFromItem(t));
    const uniqueLeagues = Array.from(new Set(tabletLeagues)).filter(l => l !== 'Other');

    // 1. League Loyalty Bonus (Pure Meta: 3 tablets of the same preferred league)
    if (uniqueLeagues.length === 1 && tablets.length === 3) {
        const preferredTag = uniqueLeagues[0];
        // If this league is a priority in the strategy, apply loyalty bonus
        if ((stratDef.tagWeights[preferredTag] || 0) > 1.5) {
            totalSynergyMultiplier *= (stratDef.leagueLoyalty || 1.5);
        }
    }

    // 2. Mix Mastery Bonus (Modular Cocktail: Mixed preferred leagues)
    // Identify high-priority leagues (weight > 1.5)
    const highPriorityLeagues = Object.entries(stratDef.tagWeights)
        .filter(([tag, weight]) => weight > 1.5 && tag !== 'efficiency' && tag !== 'rarity')
        .map(([tag]) => tag);

    if (highPriorityLeagues.length >= 2) {
        // Find how many of these high-priority leagues are present in the tablets
        const presentHighPriorityLeagues = highPriorityLeagues.filter(l => uniqueLeagues.includes(l));

        // If we have at least 2 different high priority leagues in the set, apply Mix Master bonus
        if (presentHighPriorityLeagues.length >= 2 && uniqueLeagues.length >= 2) {
            totalSynergyMultiplier *= (stratDef.mixMastery || 1.4);
        }
    }

    return Math.floor(totalScore * totalSynergyMultiplier);
}

// Helpers
function getItemTags(item: ParsedItem): string[] {
    const tags = new Set<string>();
    POE2_MODS_DATABASE.forEach(mod => {
        if (item.originalText.toLowerCase().includes(mod.text.toLowerCase())) {
            mod.tags.forEach(t => tags.add(t));
        }
    });
    return Array.from(tags);
}

function getLeagueFromItem(item: ParsedItem): string {
    const lowerName = item.name.toLowerCase();

    // Irradiated is special, maps to efficiency tag but behaves like a league for mix purposes
    if (lowerName.includes('irradiated')) return 'efficiency';

    for (const def of PRECURSOR_TABLETS) {
        if (lowerName.includes(def.id.toLowerCase())) return def.id;
    }

    return 'Other';
}
