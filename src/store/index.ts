import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ParsedItem } from '../types';
import { STRATEGIES, type StrategyName, type ScoringWeights, DEFAULT_STRATEGY } from '../lib/strategies';
import { calculateScore } from '../lib/scoring';

interface AppState {
    items: ParsedItem[];
    addItem: (item: ParsedItem) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;
    isMonitoring: boolean;
    setIsMonitoring: (isMonitoring: boolean) => void;

    // Strategy State
    activeStrategy: string;
    customStrategies: Record<string, {
        name: string;
        description: string;
        color: string;
        targetModIds?: string[];
        tagWeights: Record<string, number>;
        synergyMultiplier: number;
        leagueLoyalty: number;
        mixMastery: number;
    }>;
    setStrategy: (strategy: string) => void;
    validateState: () => void;

    // Custom Strategy Actions
    addCustomStrategy: (strategy: {
        name: string;
        description: string;
        color: string;
        targetModIds?: string[];
        tagWeights: Record<string, number>;
        synergyMultiplier: number;
        leagueLoyalty: number;
        mixMastery: number;
    }) => void;
    updateCustomStrategy: (id: string, strategy: Partial<{
        name: string;
        description: string;
        color: string;
        targetModIds: string[];
        tagWeights: Record<string, number>;
        synergyMultiplier: number;
        leagueLoyalty: number;
        mixMastery: number;
    }>) => void;
    removeCustomStrategy: (id: string) => void;

    // Weights (Legacy, kept for structure but mostly ignored by new engine)
    weights: ScoringWeights;
    updateWeights: (newWeights: Partial<ScoringWeights>) => void;

    // Usage Tracking
    usageHistory: UsageEntry[];
    markAsUsed: (waystoneId: string, tabletIds: string[], score: number) => void;
    clearHistory: () => void;
}

export interface UsageEntry {
    id: string;
    waystoneName: string;
    tablets: { id: string; name: string }[];
    timestamp: number;
    score: number;
    strategy: string;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => {
                console.log('%c ITEM DETECTED: ' + item.name, 'background: #22c55e; color: white; font-weight: bold; padding: 2px 5px;');
                const itemWithCorrectScore = {
                    ...item,
                    score: calculateScore(item, state.activeStrategy)
                };
                return { items: [itemWithCorrectScore, ...state.items].slice(0, 100) };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),
            clearItems: () => set({ items: [] }),
            isMonitoring: true,
            setIsMonitoring: (isMonitoring) => set({ isMonitoring }),

            activeStrategy: DEFAULT_STRATEGY,
            customStrategies: {},

            setStrategy: (strategy) => set((state) => {
                const stratDef = STRATEGIES[strategy as StrategyName] || state.customStrategies[strategy];
                const newWeights = stratDef?.weights || STRATEGIES['Generic'].weights;

                const newItems = state.items.map(item => ({
                    ...item,
                    score: calculateScore(item, strategy)
                }));
                return {
                    activeStrategy: strategy,
                    weights: newWeights,
                    items: newItems
                };
            }),
            validateState: () => set((state) => {
                const isValid = STRATEGIES[state.activeStrategy as StrategyName] || state.customStrategies[state.activeStrategy];
                if (!isValid) {
                    const fallback = DEFAULT_STRATEGY;
                    return {
                        activeStrategy: fallback,
                        weights: STRATEGIES[fallback].weights,
                        items: state.items.map(item => ({
                            ...item,
                            score: calculateScore(item, fallback)
                        }))
                    };
                }
                return state;
            }),

            addCustomStrategy: (strategy) => set((state) => ({
                customStrategies: {
                    ...state.customStrategies,
                    [`custom-${Date.now()}`]: strategy
                }
            })),

            updateCustomStrategy: (id, strategy) => set((state) => ({
                customStrategies: {
                    ...state.customStrategies,
                    [id]: { ...state.customStrategies[id], ...strategy }
                }
            })),

            removeCustomStrategy: (id) => set((state) => {
                const newCustom = { ...state.customStrategies };
                delete newCustom[id];

                // If we're removing the active strategy, fallback to default
                if (state.activeStrategy === id) {
                    return {
                        customStrategies: newCustom,
                        activeStrategy: DEFAULT_STRATEGY,
                        weights: STRATEGIES[DEFAULT_STRATEGY].weights
                    };
                }

                return { customStrategies: newCustom };
            }),

            weights: STRATEGIES[DEFAULT_STRATEGY].weights,
            updateWeights: (newWeights) => set((state) => {
                const allowedKeys = Object.keys(STRATEGIES['Generic'].weights);
                const filteredNewWeights = Object.fromEntries(
                    Object.entries(newWeights).filter(([key]) => allowedKeys.includes(key))
                );

                const updatedWeights = { ...state.weights, ...filteredNewWeights } as ScoringWeights;

                // Final safety: filter the state weights too
                const safeWeights = Object.fromEntries(
                    Object.entries(updatedWeights).filter(([key]) => allowedKeys.includes(key))
                ) as ScoringWeights;

                const newItems = state.items.map(item => ({
                    ...item,
                    score: calculateScore(item, state.activeStrategy)
                }));
                return {
                    weights: safeWeights,
                    items: newItems
                };
            }),

            usageHistory: [],
            markAsUsed: (waystoneId, tabletIds, score) => set((state) => {
                const waystone = state.items.find(i => i.id === waystoneId);
                if (!waystone) return state;

                const usedTablets = state.items.filter(i => tabletIds.includes(i.id));

                // 1. Create history entry
                const entry: UsageEntry = {
                    id: `usage-${Date.now()}`,
                    waystoneName: waystone.name,
                    tablets: usedTablets.map(t => ({ id: t.id, name: t.name })),
                    timestamp: Date.now(),
                    score,
                    strategy: state.activeStrategy
                };

                // 2. Remove waystone and update tablets
                const newItems = state.items
                    .filter(i => i.id !== waystoneId) // Remove waystone
                    .map(item => {
                        if (tabletIds.includes(item.id)) {
                            // Decrement use
                            return { ...item, uses: Math.max(0, item.uses - 1) };
                        }
                        return item;
                    })
                    .filter(item => {
                        // Remove tablets with 0 uses
                        if (item.type === 'Tablet' && item.uses <= 0) return false;
                        return true;
                    });

                return {
                    items: newItems,
                    usageHistory: [entry, ...state.usageHistory].slice(0, 100)
                };
            }),
            clearHistory: () => set({ usageHistory: [] }),
        }),
        {
            name: 'atlas-sentinel-storage',
            version: 10, // Revert hotkey
        }
    )
);
