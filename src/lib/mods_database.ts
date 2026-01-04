
export interface ModDefinition {
    id: string;
    text: string;
    category: 'prefix' | 'suffix' | 'league' | 'special';
    type: 'Waystone' | 'Tablet' | 'Both';
    tags: string[];
    strategyRelevance: string[]; // Strategies where this mod is S-Tier/A-Tier
    baseValue: number; // Base score value for this mod
}

export const POE2_MODS_DATABASE: ModDefinition[] = [
    // --- WAYSTONE PREFIXES (REWARDS) ---
    { id: 'w_quant', text: 'Increased Quantity of Items found in the Area', category: 'prefix', type: 'Waystone', tags: ['efficiency', 'drops'], strategyRelevance: ['Gold Rain', 'Logistic Excavation', 'Generic'], baseValue: 50 },
    { id: 'w_rarity', text: 'Increased Rarity of Items found in the Area', category: 'prefix', type: 'Waystone', tags: ['rarity', 'drops'], strategyRelevance: ['Blood Gambler', 'Boss Hunter', 'Generic'], baseValue: 50 },
    { id: 'w_gold', text: 'Increased Gold found in the Area', category: 'prefix', type: 'Waystone', tags: ['gold'], strategyRelevance: ['Gold Rain'], baseValue: 40 },
    { id: 'w_packsize', text: 'Increased Pack size', category: 'prefix', type: 'Waystone', tags: ['efficiency', 'monsters'], strategyRelevance: ['Mist Engine', 'Infinite Abyss', 'Generic'], baseValue: 60 },
    { id: 'w_rare_monsters', text: 'Increased Rare Monsters', category: 'prefix', type: 'Waystone', tags: ['monsters', 'xp'], strategyRelevance: ['Infinite Abyss', 'Logistic Excavation'], baseValue: 70 },
    { id: 'w_magic_monsters', text: 'Increased Magic Monsters', category: 'prefix', type: 'Waystone', tags: ['monsters', 'xp'], strategyRelevance: ['Mist Engine', 'Infinite Abyss'], baseValue: 40 },
    { id: 'w_exp', text: 'Increased Experience gain', category: 'prefix', type: 'Waystone', tags: ['xp'], strategyRelevance: ['Infinite Abyss'], baseValue: 50 },

    // --- WAYSTONE SUFFIXES (DIFFICULTY/WAYSTONE DROPS) ---
    { id: 'w_drop_chance', text: 'Increased Waystones found in Area', category: 'suffix', type: 'Waystone', tags: ['waystones'], strategyRelevance: ['Boss Hunter', 'Generic'], baseValue: 30 },

    // --- TABLET SPECIFIC MODS ---
    // Breach
    { id: 't_breach_quant', text: 'increased Quantity of Items found in your Maps', category: 'league', type: 'Tablet', tags: ['breach', 'efficiency'], strategyRelevance: ['Gold Rain', 'Generic'], baseValue: 80 },
    { id: 't_breach_monsters', text: 'Breaches remain open while there are alive Breach Monsters', category: 'league', type: 'Tablet', tags: ['breach', 'monsters'], strategyRelevance: ['Gold Rain', 'Mist Engine'], baseValue: 100 },

    // Expedition
    { id: 't_exp_logbooks', text: 'Increased Quantity of Expedition Logbooks dropped by Runic Monsters in your Maps', category: 'league', type: 'Tablet', tags: ['expedition', 'drops'], strategyRelevance: ['Logistic Excavation'], baseValue: 150 },
    { id: 't_exp_markers', text: 'Your Maps contain increased number of Runic Monster Markers', category: 'league', type: 'Tablet', tags: ['expedition'], strategyRelevance: ['Logistic Excavation'], baseValue: 100 },
    { id: 't_exp_duplicate', text: 'Runic Monsters in your Maps are Duplicated', category: 'league', type: 'Tablet', tags: ['expedition', 'monsters'], strategyRelevance: ['Logistic Excavation'], baseValue: 120 },

    // Delirium
    { id: 't_deli_splinters', text: 'increased stack size of Simulacrum Splinters', category: 'league', type: 'Tablet', tags: ['delirium', 'drops'], strategyRelevance: ['Mist Engine'], baseValue: 120 },
    { id: 't_deli_progress', text: 'increased reward progress from Delirious Monsters', category: 'league', type: 'Tablet', tags: ['delirium'], strategyRelevance: ['Mist Engine'], baseValue: 130 },
    { id: 't_deli_never_dissipates', text: 'Delirium Fog in your Maps never dissipates', category: 'league', type: 'Tablet', tags: ['delirium'], strategyRelevance: ['Mist Engine'], baseValue: 150 },

    // Ritual
    { id: 't_rit_tribute', text: 'Monsters Sacrificed at Ritual Altars in your Maps grant increased Tribute', category: 'league', type: 'Tablet', tags: ['ritual'], strategyRelevance: ['Blood Gambler'], baseValue: 100 },
    { id: 't_rit_reroll_cost', text: 'Rerolling/Deferring Favours at Ritual Altars in your Maps costs reduced Tribute', category: 'league', type: 'Tablet', tags: ['ritual'], strategyRelevance: ['Blood Gambler'], baseValue: 120 },
    { id: 't_rit_reroll_free', text: 'Favours Rerolled at Ritual Altars in your Maps have a chance to cost no Tribute', category: 'league', type: 'Tablet', tags: ['ritual'], strategyRelevance: ['Blood Gambler'], baseValue: 110 },

    // Abyss
    { id: 't_abyss_pits', text: 'Abysses have additional pits', category: 'league', type: 'Tablet', tags: ['abyss'], strategyRelevance: ['Infinite Abyss'], baseValue: 100 },
    { id: 't_abyss_overrun', text: 'Overrun by Abyssals', category: 'league', type: 'Tablet', tags: ['abyss', 'monsters'], strategyRelevance: ['Infinite Abyss'], baseValue: 150 },

    // Overseer
    { id: 't_boss_mod', text: 'Map Bosses have 1 additional Modifier', category: 'league', type: 'Tablet', tags: ['boss'], strategyRelevance: ['Boss Hunter'], baseValue: 120 },
    { id: 't_boss_hunted', text: 'Map Bosses are Hunted by Azmeri Spirits', category: 'league', type: 'Tablet', tags: ['boss'], strategyRelevance: ['Boss Hunter'], baseValue: 140 },
];
