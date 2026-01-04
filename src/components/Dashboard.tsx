import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Play, Pause, Trash2, Copy, Zap, Layers, Gem, ChevronDown, ChevronRight, Archive } from 'lucide-react';
import { STRATEGIES, type StrategyName } from '../lib/strategies';
import { StrategySelector } from './StrategySelector';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { ParsedItem } from '../types';

export const Dashboard: React.FC = () => {
    const {
        items,
        isMonitoring,
        setIsMonitoring,
        clearItems
    } = useStore();

    const [activeTab, setActiveTab] = useState<'Waystones' | 'Tablets'>('Waystones');
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);


    const toggleGroup = (id: string) => {
        setExpandedGroups((prev: string[]) => prev.includes(id) ? prev.filter((x: string) => x !== id) : [...prev, id]);
    };

    const waystones = useMemo(() => items.filter((i: ParsedItem) => i.type === 'Waystone'), [items]);
    const tablets = useMemo(() => items.filter((i: ParsedItem) => i.type === 'Tablet'), [items]);

    const waystoneGroups = useMemo(() => {
        const groups: Record<number, ParsedItem[]> = {};
        waystones.forEach((w: ParsedItem) => {
            if (!groups[w.tier]) groups[w.tier] = [];
            groups[w.tier].push(w);
        });
        return groups;
    }, [waystones]);

    const tabletGroups = useMemo(() => {
        const groups: Record<string, ParsedItem[]> = {};
        tablets.forEach((t: ParsedItem) => {
            const subType = t.subType || 'Other';
            if (!groups[subType]) groups[subType] = [];
            groups[subType].push(t);
        });
        return groups;
    }, [tablets]);

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 w-full">
            {/* Header / Strategy Selector */}
            <header className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10 w-full">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Archive className="text-cyan-400 fill-cyan-400/20" />
                                    Stash
                                </h2>
                                <p className="text-slate-400 text-xs font-medium">Scanned: {items.length} items</p>
                            </div>
                            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                                <TabButton
                                    active={activeTab === 'Waystones'}
                                    onClick={() => setActiveTab('Waystones')}
                                    icon={<Layers size={14} />}
                                    label="Waystones"
                                    count={waystones.length}
                                />
                                <TabButton
                                    active={activeTab === 'Tablets'}
                                    onClick={() => setActiveTab('Tablets')}
                                    icon={<Gem size={14} />}
                                    label="Tablets"
                                    count={tablets.length}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMonitoring(!isMonitoring)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300",
                                    isMonitoring
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                )}
                            >
                                {isMonitoring ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                                {isMonitoring ? "Active" : "Paused"}
                            </button>

                            <button
                                onClick={clearItems}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                                title="Clear All"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>




                    {/* Premium Strategy Selector */}
                    <StrategySelector />
                </div>
            </header>

            {/* Content area */}
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-[1600px] mx-auto w-full">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Waystones' ? (
                            <motion.div
                                key="waystones"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex flex-col gap-8"
                            >
                                {waystones.length === 0 ? (
                                    <EmptyState message="No Waystones detected." />
                                ) : (
                                    Object.entries(waystoneGroups).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([tier, tierItems]: [string, ParsedItem[]]) => (
                                        <GroupSection
                                            key={`tier-${tier}`}
                                            title={`Tier ${tier}`}
                                            count={tierItems.length}
                                            isExpanded={!expandedGroups.includes(`tier-${tier}`)}
                                            onToggle={() => toggleGroup(`tier-${tier}`)}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                                                {tierItems.map((item: ParsedItem) => <ItemCard key={item.id} item={item} />)}
                                            </div>
                                        </GroupSection>
                                    ))
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tablets"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col gap-8"
                            >
                                {tablets.length === 0 ? (
                                    <EmptyState message="No Tablets detected." />
                                ) : (
                                    Object.entries(tabletGroups).sort((a, b) => a[0].localeCompare(b[0])).map(([subType, typeItems]: [string, ParsedItem[]]) => (
                                        <GroupSection
                                            key={`type-${subType}`}
                                            title={`${subType} Tablets`}
                                            count={typeItems.length}
                                            isExpanded={!expandedGroups.includes(`type-${subType}`)}
                                            onToggle={() => toggleGroup(`type-${subType}`)}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                                                {typeItems.map((item: ParsedItem) => <ItemCard key={item.id} item={item} />)}
                                            </div>
                                        </GroupSection>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count: number }> = ({ active, onClick, icon, label, count }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300",
            active
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
        )}
    >
        {icon}
        {label}
        <span className={clsx(
            "ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums border",
            active ? "bg-indigo-500/20 border-indigo-500/30" : "bg-slate-900 border-slate-700"
        )}>
            {count}
        </span>
    </button>
);

const GroupSection: React.FC<{ title: string, count: number, children: React.ReactNode, isExpanded: boolean, onToggle: () => void }> = ({ title, count, children, isExpanded, onToggle }) => (
    <div className="space-y-4">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full group/header"
        >
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-800/50 rounded-lg border border-slate-700 group-hover/header:border-indigo-500/50 transition-colors">
                    {isExpanded ? <ChevronDown size={14} className="text-indigo-400" /> : <ChevronRight size={14} className="text-slate-500" />}
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover/header:text-slate-200 transition-colors">
                    {title}
                    <span className="ml-2 text-slate-600 font-bold">({count})</span>
                </h3>
            </div>
            <div className="flex-1 h-px bg-slate-800/50 mx-6" />
        </button>
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const ItemCard: React.FC<{ item: ParsedItem }> = ({ item }) => {
    const { activeStrategy, removeItem } = useStore();
    const [isCopied, setIsCopied] = useState(false);

    const hasCrucialMod = useMemo(() => {
        if (!activeStrategy) return false;
        const stratDef = STRATEGIES[activeStrategy as StrategyName];
        if (!stratDef) return false;
        return stratDef.crucialMods?.some(mod =>
            item.originalText.toLowerCase().includes(mod.toLowerCase())
        );
    }, [item.originalText, activeStrategy]);

    const copyText = () => {
        navigator.clipboard.writeText(item.name);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/40 transition-all duration-500 backdrop-blur-sm flex flex-col h-full"
        >
            <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={clsx(
                                "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight border",
                                item.rarity === 'Unique' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                    item.rarity === 'Rare' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                        item.rarity === 'Magic' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                            "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}>
                                {item.rarity}
                            </span>
                            {item.corrupted && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                    Corrupted
                                </span>
                            )}
                            {hasCrucialMod && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 animate-pulse">
                                    Crucial
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <h4
                                onClick={copyText}
                                className="text-lg font-black text-white leading-tight hover:text-indigo-400 transition-colors italic tracking-tight cursor-pointer active:scale-95"
                                title="Click to copy item name"
                            >
                                {item.name}
                            </h4>
                            <AnimatePresence>
                                {isCopied && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: -5 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute -top-6 left-0 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shadow-lg shadow-indigo-500/10"
                                    >
                                        Copied!
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-3xl font-black text-white tabular-nums leading-none tracking-tighter">
                            {item.score}
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400/60 mt-1">
                            Score
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                    {Object.entries(item.stats).map(([key, val]) => (
                        val > 0 && (
                            <div key={key} className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 opacity-60">
                                    {key.replace('item', '').replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-xs font-bold text-slate-300">+{val}%</span>
                            </div>
                        )
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                        {item.type === 'Waystone' ? (
                            `Tier ${item.tier}`
                        ) : (
                            `${item.uses} Uses • ${item.subType || 'Tablet'}`
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={copyText}
                        className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-indigo-500/20"
                        title="Copy Text"
                    >
                        <Copy size={14} />
                    </button>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                        title="Remove Item"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl"
    >
        <Zap className="text-slate-700 mb-4" size={32} />
        <p className="text-slate-500 font-medium text-sm">{message}</p>
        <p className="text-slate-600 text-xs mt-2 italic px-8">Copie um item no jogo (Ctrl + C) para começar a monitorar.</p>
    </motion.div>
);
