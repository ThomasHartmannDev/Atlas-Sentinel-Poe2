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

export type StrategyName = 'Generic' | 'Infinite Abyss' | 'Currency Rain' | 'Blood Gambler' | 'Mist Engine' | 'Logistic Excavation' | 'Boss Hunter';

export interface Strategy {
    name: string;
    description: string;
    color: string;
    weights: ScoringWeights;
    synergyStats: string[];
    treeImage?: string;
    crucialMods?: string[];
}

export const STRATEGIES: Record<StrategyName, Strategy> = {
    'Generic': {
        name: 'Generic Farming',
        description: 'Balanced weights for general loot and performance.',
        color: '#64748b',
        weights: {
            quantity: 5,
            rarity: 5,
            packSize: 5,
            gold: 3,
            delirium: 2,
            corruptionBonus: 10,
            magicMonsters: 5,
            rareMonsters: 5,
            expGain: 2
        },
        synergyStats: ['itemQuantity', 'packSize']
    },
    'Infinite Abyss': {
        name: 'Infinite Abyss',
        description: 'Experience (XP), ilvl 84+ bases and Abyssal Jewels.',
        color: '#a855f7',
        weights: {
            quantity: 4,
            rarity: 6,
            packSize: 10,
            gold: 0,
            delirium: 0,
            corruptionBonus: 15,
            magicMonsters: 8,
            rareMonsters: 10,
            expGain: 10
        },
        synergyStats: ['rareMonsters', 'expGain', 'packSize'],
        crucialMods: ['Overrun by Abyssals', 'Experience Gain'],
        treeImage: 'C:/Users/hartm/.gemini/antigravity/brain/c05295f6-6f7b-4ed3-b373-7427e12efe1f/breachlord_tree_1767491413883.png'
    },
    'Currency Rain': {
        name: 'Currency Rain',
        description: 'Divines and Raw Currency.',
        color: '#22c55e',
        weights: {
            quantity: 10,
            rarity: 8,
            packSize: 9,
            gold: 10,
            delirium: 0,
            corruptionBonus: 20,
            magicMonsters: 7,
            rareMonsters: 6,
            expGain: 0
        },
        synergyStats: ['itemQuantity', 'gold'],
        crucialMods: ['Monster Effectiveness', 'Local Knowledge'],
        treeImage: 'C:/Users/hartm/.gemini/antigravity/brain/c05295f6-6f7b-4ed3-b373-7427e12efe1f/cleansed_water_tree_1767491383467.png'
    },
    'Blood Gambler': {
        name: 'Blood Gambler',
        description: 'High-value Ritual Omens and T0 Uniques.',
        color: '#ef4444',
        weights: {
            quantity: 3,
            rarity: 10,
            packSize: 8,
            gold: 0,
            delirium: 0,
            corruptionBonus: 5,
            magicMonsters: 4,
            rareMonsters: 7,
            expGain: 0
        },
        synergyStats: ['itemRarity', 'packSize'],
        crucialMods: ['Reduced Reroll Cost', 'Tribute from Sacrificed Monsters'],
        treeImage: 'C:/Users/hartm/.gemini/antigravity/brain/c05295f6-6f7b-4ed3-b373-7427e12efe1f/ritual_omen_tree_1767491398803.png'
    },
    'Mist Engine': {
        name: 'Mist Engine',
        description: 'Simulacrum Splinters and Cluster Jewels (Delirium Hybrid).',
        color: '#6366f1',
        weights: {
            quantity: 6,
            rarity: 5,
            packSize: 10,
            gold: 2,
            delirium: 10,
            corruptionBonus: 10,
            magicMonsters: 8,
            rareMonsters: 9,
            expGain: 4
        },
        synergyStats: ['delirium', 'packSize'],
        crucialMods: ['increases faster with distance', 'Slaying Rare Monsters pauses']
    },
    'Logistic Excavation': {
        name: 'Logistic Excavation',
        description: 'Expedition Logbooks and Trog Artifacts.',
        color: '#eab308',
        weights: {
            quantity: 10,
            rarity: 3,
            packSize: 9,
            gold: 5,
            delirium: 0,
            corruptionBonus: 5,
            magicMonsters: 4,
            rareMonsters: 10,
            expGain: 0
        },
        synergyStats: ['itemQuantity', 'packSize'],
        crucialMods: ['Quantity of Logbooks', 'Runic Monster Markers'],
        treeImage: 'C:/Users/hartm/.gemini/antigravity/brain/c05295f6-6f7b-4ed3-b373-7427e12efe1f/expedition_tree_1767491429700.png'
    },
    'Boss Hunter': {
        name: 'Boss Hunter',
        description: 'Boss Uniques, T16 Maps and Fragments.',
        color: '#f97316',
        weights: {
            quantity: 4,
            rarity: 10,
            packSize: 0,
            gold: 0,
            delirium: 0,
            corruptionBonus: 20,
            magicMonsters: 0,
            rareMonsters: 0,
            expGain: 0
        },
        synergyStats: ['itemRarity', 'corruptionBonus'],
        crucialMods: ['Map Drop Chance', 'Twin Bosses', 'additional Unique Item']
    }
};

export const DEFAULT_STRATEGY: StrategyName = 'Infinite Abyss';
