export interface TabletDefinition {
    id: string;
    name: string;
    description: string;
}

export const PRECURSOR_TABLETS: TabletDefinition[] = [
    { id: 'breach', name: 'Breach Precursor Tablet', description: 'Adiciona fendas (Breaches) aos mapas.' },
    { id: 'expedition', name: 'Expedition Precursor Tablet', description: 'Adiciona encontros de expedição (Kalguuran Expedition).' },
    { id: 'delirium', name: 'Delirium Precursor Tablet', description: 'Adiciona o Espelho do Delírio (Mirror of Delirium).' },
    { id: 'ritual', name: 'Ritual Precursor Tablet', description: 'Adiciona Altares Ritualísticos (Ritual Altars).' },
    { id: 'overseer', name: 'Overseer Precursor Tablet', description: 'Fortalece o chefe do mapa (geralmente adicionando bônus ou modificadores extras ao Boss).' },
    { id: 'standard', name: 'Precursor Tablet (Padrão)', description: 'Torna os mapas "Irradiados" (Irradiated), o que aumenta o nível da área (+1) e a dificuldade/recompensas gerais.' },
    { id: 'abyss', name: 'Abyss Precursor Tablet', description: 'Adiciona abismos (Abysses) aos mapas.' }
];

export interface Strategy {
    name: string;
    description: string;
    color: string;
    weights: ScoringWeights;
    synergyStats: string[];
    treeImage?: string;
    crucialMods?: string[];
    targetModIds?: string[]; // IDs from POE2_MODS_DATABASE
    tagWeights: Record<string, number>; // Weights for tags (e.g. { efficiency: 1.5, gold: 2.0 })
    synergyMultiplier: number; // Multiplier when tags match between Waystone and Tablets
    leagueLoyalty: number; // Multiplier for "Pure Sets" (3 tablets of the same league)
    mixMastery: number; // Multiplier for "Modular Sets" (Mixed leagues)
}

export interface ScoringWeights {
    quantity: number;
    rarity: number;
    packSize: number;
    gold: number;
    delirium: number;
    corruptionBonus: number;
    magicMonsters: number;
    rareMonsters: number;
    expGain: number;
}

export type StrategyName = 'Generic' | 'Infinite Abyss' | 'Gold Rain' | 'Blood Gambler' | 'Mist Engine' | 'Logistic Excavation' | 'Boss Hunter';

export const STRATEGIES: Record<StrategyName, Strategy> = {
    'Generic': {
        name: 'Generic Farming',
        description: 'Balanced weights for general loot and performance.',
        color: '#64748b',
        weights: { quantity: 5, rarity: 5, packSize: 5, gold: 3, delirium: 2, corruptionBonus: 10, magicMonsters: 5, rareMonsters: 5, expGain: 2 },
        synergyStats: ['itemQuantity', 'packSize'],
        targetModIds: ['w_quant', 'w_rarity', 'w_packsize', 't_breach_quant'],
        tagWeights: { efficiency: 1.0, drops: 1.0, monsters: 1.0 },
        synergyMultiplier: 1.2,
        leagueLoyalty: 1.0,
        mixMastery: 1.0
    },
    'Infinite Abyss': {
        name: 'Infinite Abyss',
        description: 'Experience (XP), ilvl 84+ bases and Abyssal Jewels.',
        color: '#a855f7',
        weights: { quantity: 4, rarity: 6, packSize: 10, gold: 0, delirium: 0, corruptionBonus: 15, magicMonsters: 8, rareMonsters: 10, expGain: 10 },
        synergyStats: ['rareMonsters', 'expGain', 'packSize'],
        crucialMods: ['Overrun by Abyssals', 'Experience Gain'],
        targetModIds: ['w_rare_monsters', 'w_exp', 'w_packsize', 't_abyss_pits', 't_abyss_overrun'],
        tagWeights: { xp: 2.0, monsters: 1.5, abyss: 2.0, efficiency: 1.2 },
        synergyMultiplier: 1.5,
        leagueLoyalty: 1.8,
        mixMastery: 1.2
    },
    'Gold Rain': {
        name: 'Gold Rain',
        description: 'Maximized Gold found in maps.',
        color: '#22c55e',
        weights: { quantity: 10, rarity: 8, packSize: 9, gold: 10, delirium: 0, corruptionBonus: 20, magicMonsters: 7, rareMonsters: 6, expGain: 0 },
        synergyStats: ['itemQuantity', 'gold'],
        crucialMods: ['Monster Effectiveness', 'Local Knowledge'],
        targetModIds: ['w_gold', 'w_quant', 'w_packsize', 't_breach_quant', 't_breach_monsters'],
        tagWeights: { gold: 2.5, efficiency: 1.5, drops: 1.2, breach: 1.5 },
        synergyMultiplier: 1.4,
        leagueLoyalty: 1.5,
        mixMastery: 1.3
    },
    'Blood Gambler': {
        name: 'Blood Gambler',
        description: 'High-value Ritual Omens and T0 Uniques.',
        color: '#ef4444',
        weights: { quantity: 3, rarity: 10, packSize: 8, gold: 0, delirium: 0, corruptionBonus: 5, magicMonsters: 4, rareMonsters: 7, expGain: 0 },
        synergyStats: ['itemRarity', 'packSize'],
        crucialMods: ['Reduced Reroll Cost', 'Tribute from Sacrificed Monsters'],
        targetModIds: ['w_rarity', 't_rit_tribute', 't_rit_reroll_cost', 't_rit_reroll_free'],
        tagWeights: { ritual: 2.5, rarity: 2.0, efficiency: 1.2 },
        synergyMultiplier: 1.6,
        leagueLoyalty: 1.7,
        mixMastery: 1.4
    },
    'Mist Engine': {
        name: 'Mist Engine',
        description: 'Simulacrum Splinters and Cluster Jewels (Delirium Hybrid).',
        color: '#6366f1',
        weights: { quantity: 6, rarity: 5, packSize: 10, gold: 2, delirium: 10, corruptionBonus: 10, magicMonsters: 8, rareMonsters: 9, expGain: 4 },
        synergyStats: ['delirium', 'packSize'],
        crucialMods: ['increases faster with distance', 'Slaying Rare Monsters pauses'],
        targetModIds: ['w_packsize', 'w_magic_monsters', 't_deli_splinters', 't_deli_progress', 't_deli_never_dissipates'],
        tagWeights: { delirium: 2.5, monsters: 1.5, efficiency: 1.3 },
        synergyMultiplier: 1.5,
        leagueLoyalty: 1.6,
        mixMastery: 1.4
    },
    'Logistic Excavation': {
        name: 'Logistic Excavation',
        description: 'Expedition Logbooks and Trog Artifacts.',
        color: '#eab308',
        weights: { quantity: 10, rarity: 3, packSize: 9, gold: 5, delirium: 0, corruptionBonus: 5, magicMonsters: 4, rareMonsters: 10, expGain: 0 },
        synergyStats: ['itemQuantity', 'packSize'],
        crucialMods: ['Quantity of Logbooks', 'Runic Monster Markers'],
        targetModIds: ['w_quant', 'w_rare_monsters', 't_exp_logbooks', 't_exp_markers', 't_exp_duplicate'],
        tagWeights: { expedition: 2.5, efficiency: 1.4, monsters: 1.2, drops: 1.5 },
        synergyMultiplier: 1.6,
        leagueLoyalty: 1.9,
        mixMastery: 1.3
    },
    'Boss Hunter': {
        name: 'Boss Hunter',
        description: 'Boss Uniques, T16 Maps and Fragments.',
        color: '#f97316',
        weights: { quantity: 4, rarity: 10, packSize: 0, gold: 0, delirium: 0, corruptionBonus: 20, magicMonsters: 0, rareMonsters: 0, expGain: 0 },
        synergyStats: ['itemRarity', 'corruptionBonus'],
        crucialMods: ['Map Drop Chance', 'Twin Bosses', 'additional Unique Item'],
        targetModIds: ['w_rarity', 'w_drop_chance', 't_boss_mod', 't_boss_hunted'],
        tagWeights: { boss: 3.0, rarity: 2.0, waystones: 1.5 },
        synergyMultiplier: 1.3,
        leagueLoyalty: 1.4,
        mixMastery: 1.2
    }
};

export const DEFAULT_STRATEGY: StrategyName = 'Infinite Abyss';
