import React, { useState } from 'react';
import { useStore } from '../store';
import { findBestSets } from '../lib/optimizer';
import { STRATEGIES, type StrategyName } from '../lib/strategies';
import { StrategySelector } from './StrategySelector';
import { TrendingUp, Plus, Copy, CheckCircle2, Sparkles, Info, Check, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Optimizer: React.FC = () => {
    const { items, weights, activeStrategy, customStrategies, markAsUsed } = useStore();
    const [confirmUsed, setConfirmUsed] = useState<{ open: boolean; set: any; rank: number }>({
        open: false,
        set: null,
        rank: 0
    });

    const strategy = STRATEGIES[activeStrategy as StrategyName] || customStrategies[activeStrategy];
    const bestSets = findBestSets(items, weights);

    if (!strategy) return null;

    const handleConfirmUsed = () => {
        if (confirmUsed.set) {
            markAsUsed(
                confirmUsed.set.waystone.id,
                confirmUsed.set.tablets.map((t: any) => t.id),
                confirmUsed.set.totalScore
            );
            setConfirmUsed({ open: false, set: null, rank: 0 });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] w-full relative">
            <header className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl w-full">
                <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="text-cyan-400" size={32} />
                                <h2 className="text-4xl font-black text-white tracking-tight italic">Best Sets</h2>
                            </div>
                            <p className="text-slate-400 font-medium text-sm">
                                Optimizing inventory for the active strategy
                            </p>
                        </motion.div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 backdrop-blur">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Inventory Analysis</span>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                    <span className="text-cyan-400">{items.filter(i => i.type === 'Waystone').length} Waystones</span>
                                    <span className="text-indigo-400">{items.filter(i => i.type === 'Tablet').length} Tablets</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/50">
                        <StrategySelector activeColor="cyan" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 custom-scrollbar">
                <div className="max-w-[1600px] mx-auto w-full min-h-0 space-y-8 pr-2">
                    {bestSets.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl"
                        >
                            <Plus className="text-slate-700 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-500 uppercase tracking-wider">Insufficient Data</h3>
                            <p className="text-slate-600 max-w-sm mt-2 font-medium">
                                Need at least 1 Waystone and 3 Tablets to calculate optimal farming sets.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 pb-10">
                            <AnimatePresence initial={false}>
                                {bestSets.map((set, idx) => (
                                    <SetCard
                                        key={`${set.waystone.id}-${idx}`}
                                        set={set}
                                        rank={idx + 1}
                                        strategy={strategy}
                                        onUsed={() => setConfirmUsed({ open: true, set, rank: idx + 1 })}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmUsed.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6 text-amber-400">
                                <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter">Confirm Execution?</h3>
                            </div>

                            <div className="space-y-4 mb-8">
                                <p className="text-slate-300 font-medium leading-relaxed">
                                    You are marking <span className="text-white font-black underline italic">Set #{confirmUsed.rank}</span> as executed. This action will:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-400">
                                        <Check size={16} className="text-emerald-500 shrink-0" />
                                        <span>Remove <span className="text-white font-bold">{confirmUsed.set?.waystone.name}</span> from inventory.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-400">
                                        <Check size={16} className="text-emerald-500 shrink-0" />
                                        <span>Consume <span className="text-white font-bold">1 charge</span> from each synergy tablet.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-indigo-400 italic">
                                        <Info size={16} className="shrink-0" />
                                        <span>Tablets with 0 charges remaining will be automatically deleted.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmUsed({ open: false, set: null, rank: 0 })}
                                    className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmUsed}
                                    className="flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    Execute Set
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SetCard: React.FC<{ set: any, rank: number, strategy: any, onUsed: () => void }> = ({ set, rank, strategy, onUsed }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const triggerCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const copySet = () => {
        const text = `Best Set #${rank}: \nWaystone: ${set.waystone.name}\nTablets: \n${set.tablets.map((t: any) => `- ${t.name}`).join('\n')}\nTotal Predicted Score: ${Math.round(set.totalScore)}`;
        navigator.clipboard.writeText(text);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: rank * 0.1 }}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl lg:rounded-[2rem] overflow-hidden hover:border-cyan-500/40 transition-all duration-500"
        >
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: strategy.color }} />

            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800/50">
                {/* Left: Score & Waystone */}
                <div className="p-6 sm:p-7 lg:w-[320px] bg-slate-800/20 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black italic">
                                #{rank}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500/60 font-mono">Recommendation</span>
                        </div>

                        <div className="mb-8">
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest block mb-1.5 pl-1">Primary Waystone</span>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex-shrink-0">
                                    <TrendingUp size={18} className="text-cyan-400" />
                                </div>
                                <div>
                                    <div className="relative">
                                        <h4
                                            onClick={() => triggerCopy(set.waystone.name, 'waystone')}
                                            className="text-lg sm:text-xl font-black text-white leading-tight hover:text-cyan-400 transition-colors cursor-pointer active:scale-95"
                                            title="Click to copy waystone name"
                                        >
                                            {set.waystone.name}
                                        </h4>
                                        <AnimatePresence>
                                            {copiedId === 'waystone' && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: -5 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute -top-6 left-0 text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                                                >
                                                    Copied!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 italic">Tier {set.waystone.tier}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800/50">
                            <div className="flex items-end gap-2 mb-6">
                                <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                    {Math.round(set.totalScore)}
                                </div>
                                <div className="flex flex-col pb-1">
                                    <span className="text-[10px] font-black text-cyan-500 tracking-wider uppercase leading-none mb-1">Score</span>
                                    <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase leading-none">Yield</span>
                                </div>
                            </div>

                            {rank === 1 && (
                                <div className="mb-6 flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-400/5 px-3 py-2 rounded-xl border border-emerald-400/10 w-fit">
                                    <Sparkles size={12} fill="currentColor" />
                                    Maximum Efficiency
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onUsed}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 group/exec border border-emerald-400/20 mt-6"
                    >
                        <div className="p-1 bg-white/20 rounded-lg group-hover/exec:scale-110 transition-transform">
                            <Check size={16} strokeWidth={4} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-xs">Execute Set</span>
                    </button>
                </div>

                {/* Right: Tablets */}
                <div className="p-6 sm:p-7 lg:flex-1 relative bg-slate-900/40">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500/60 flex items-center gap-2 ml-1 mb-0">
                            <Plus size={12} className="text-indigo-500" />
                            Synergy Tablets
                        </h5>
                        <button
                            onClick={copySet}
                            className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50"
                            title="Copy to clipboard"
                        >
                            <Copy size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 lg:gap-4">
                        {set.tablets.map((tablet: any, tidx: number) => {
                            const statsToShow = strategy.synergyStats ||
                                Object.entries(strategy.weights)
                                    .filter(([, v]) => (v as number) > 0)
                                    .map(([k]) => {
                                        const map: Record<string, string> = {
                                            quantity: 'itemQuantity',
                                            rarity: 'itemRarity'
                                        };
                                        return map[k] || k;
                                    })
                                    .slice(0, 3);
                            return (
                                <motion.div
                                    key={`${tablet.id}-${tidx}`}
                                    className="p-4 sm:p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group/tablet hover:border-indigo-500/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/10 group-hover/tablet:bg-indigo-500/40 transition-colors" />

                                    <div className="flex flex-col pl-2">
                                        <span className="text-[10px] font-black text-slate-600 uppercase mb-1 block">Slot {tidx + 1}</span>
                                        <div className="relative">
                                            <h6
                                                onClick={() => triggerCopy(tablet.name, tablet.id)}
                                                className="text-base lg:text-lg font-black text-slate-200 leading-tight hover:text-indigo-300 transition-colors cursor-pointer active:scale-95"
                                                title="Click to copy tablet name"
                                            >
                                                {tablet.name}
                                            </h6>
                                            <AnimatePresence>
                                                {copiedId === tablet.id && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute -top-6 left-0 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                                                    >
                                                        Copied!
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 lg:mt-3">
                                            {statsToShow.map((statKey: string) => {
                                                const val = (tablet.stats as any)[statKey];
                                                if (val <= 0) return null;
                                                return (
                                                    <div key={statKey} className="flex items-center gap-1 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">
                                                        <CheckCircle2 size={8} className="text-indigo-400" />
                                                        <span className="text-[9px] font-black text-indigo-300/80 uppercase tracking-tighter tabular-nums">
                                                            {statKey.replace('item', '')}: {val}%
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center bg-slate-800/30 p-1.5 rounded-lg border border-slate-700/30 min-w-[60px] text-center">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5 opacity-70">Uses Left</span>
                                        <div className="text-base font-black text-slate-200 group-hover/tablet:text-indigo-400 transition-colors tabular-nums">
                                            {tablet.uses}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-slate-600 italic text-[10px] font-bold bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                        <Info size={12} className="text-indigo-500 shrink-0" />
                        Execution will consume 1 Tablet charge and permanently archive the primary Waystone.
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
