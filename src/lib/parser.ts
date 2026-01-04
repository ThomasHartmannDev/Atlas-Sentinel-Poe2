import type { ParsedItem, ItemStats } from '../types';

export const parseItem = (text: string): ParsedItem | null => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return null;

    // Find the actual name
    let name = lines[0];
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        if (!lines[i].includes('Item Class:') && !lines[i].includes('Rarity:') && lines[i].length > 2) {
            name = lines[i];
            break;
        }
    }

    const isWaystone = text.includes('Waystones') ||
        text.includes('Waystone') ||
        text.includes('Pedra de Caminho') ||
        text.includes('Pedras de Caminho');

    const isTablet = text.includes('Tablet') ||
        text.includes('Precursor') ||
        text.includes('Tábua') ||
        text.includes('Precursora');

    if (!isWaystone && !isTablet) {
        console.warn('Parser: Non-relevant item text detected');
        return null;
    }
    const type = isWaystone ? 'Waystone' : 'Tablet';

    const tier = type === 'Waystone' ? getTier(text) : 0;
    const subType = type === 'Tablet' ? getSubType(name) : null;
    const uses = type === 'Tablet' ? getUses(text) : 1;

    const stats: ItemStats = {
        itemQuantity: getStatValue(text, 'Item Quantity'),
        itemRarity: getStatValue(text, 'Item Rarity'),
        packSize: getStatValue(text, 'Monster Pack Size'),
        gold: getStatValue(text, 'increased Gold found'),
        delirium: getStatValue(text, 'Layers to be Delirious'),
        magicMonsters: getStatValue(text, 'Magic Monsters'),
        rareMonsters: getStatValue(text, 'Rare Monsters'),
        expGain: getStatValue(text, 'Experience Gain'),
    };

    const rarity = getRarity(text);

    return {
        id: generateId(),
        name,
        rawText: text,
        type,
        subType,
        tier,
        uses,
        rarity,
        stats,
        corrupted: text.includes('Corrupted'),
        timestamp: Date.now(),
        originalText: text
    };
};

function getSubType(name: string): string {
    const types = ['Ritual', 'Delirium', 'Irradiated', 'Breach', 'Expedition', 'Precursor'];
    for (const t of types) {
        if (name.includes(t)) return t;
    }
    return 'Other';
}

function getUses(text: string): number {
    const match = text.match(/(\d+) uses remaining/) ||
        text.match(/(\d+) usos restantes/) ||
        text.match(/Cargas: (\d+)/);
    return match ? parseInt(match[1] || match[2], 10) : 1;
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTier(text: string): number {
    const match = text.match(/Tier: (\d+)/) ||
        text.match(/Tier (\d+)/) ||
        text.match(/Nível: (\d+)/) ||
        text.match(/Level: (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function getRarity(text: string): 'Normal' | 'Magic' | 'Rare' | 'Unique' {
    if (text.includes('Rarity: Normal')) return 'Normal';
    if (text.includes('Rarity: Magic')) return 'Magic';
    if (text.includes('Rarity: Rare')) return 'Rare';
    if (text.includes('Rarity: Unique')) return 'Unique';
    return 'Normal';
}


function getStatValue(text: string, statName: string): number {
    const escapedName = statName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\d+)%?.*${escapedName}|${escapedName}.*?(\\d+)%`);
    const match = text.match(regex);
    if (match) {
        return parseInt(match[1] || match[2], 10);
    }
    return 0;
}
