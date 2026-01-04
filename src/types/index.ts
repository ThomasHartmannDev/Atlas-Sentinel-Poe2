export interface ParsedItem {
    id: string;
    name: string;
    rawText: string;
    type: 'Waystone' | 'Tablet' | 'Unknown';
    subType: string | null;
    tier: number;
    uses: number;
    rarity: 'Normal' | 'Magic' | 'Rare' | 'Unique';
    corrupted: boolean;
    stats: ItemStats;
    timestamp: number;
    score?: number;
    originalText: string;
}

export interface ItemStats {
    itemQuantity: number;
    itemRarity: number;
    packSize: number;
    gold?: number;
    delirium?: number;
    magicMonsters?: number;
    rareMonsters?: number;
    expGain?: number;
}

export interface ProcessingResult {
    item: ParsedItem;
    score: number;
    strategy: string;
    notes: string[];
}
