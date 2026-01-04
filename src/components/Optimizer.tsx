import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { findBestSets } from '../lib/optimizer';
import { STRATEGIES, type StrategyName } from '../lib/strategies';
import { StrategySelector } from './StrategySelector';
import { TrendingUp, Plus, Copy, Sparkles, Info, Check, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POE2_MODS_DATABASE } from '../lib/mods_database';

export const Optimizer: React.FC = () => {
    const { items, weights, activeStrategy, customStrategies, markAsUsed } = useStore();
    const [confirmUsed, setConfirmUsed] = useState<{ open: boolean; set: any; rank: number }>({
        open: false,
        set: null,
        rank: 0
    });

    const strategy = STRATEGIES[activeStrategy as StrategyName] || customStrategies[activeStrategy];

    const bestSets = useMemo(() =>
        findBestSets(items, activeStrategy),
        [items, weights, activeStrategy]);

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
                    {/* Strategy Disclaimer */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4 backdrop-blur-sm"
                    >
                        <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-tight">Pro Tip: Generic vs Custom</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                                Built-in strategies are generic starting points. For maximum efficiency, head to the <span className="text-indigo-400 font-bold underline">Juicing Lab</span> and engineer a <span className="text-white font-bold">Custom Profile</span> tailored exactly to your items and expectations!
                            </p>
                        </div>
                    </motion.div>

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
    const [hoveredItem, setHoveredItem] = useState<any | null>(null);
    const [hoverTimeout, setHoverTimeout] = useState<any | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (item: any, e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (hoverTimeout) clearTimeout(hoverTimeout);
        const timeout = setTimeout(() => {
            setHoveredItem(item);
        }, 400);
        setHoverTimeout(timeout);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setHoverTimeout(null);
        setHoveredItem(null);
    };

    const triggerCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const copySet = () => {
        const text = `Best Set #${rank}: \nWaystone: ${set.waystone.name}\nTablets: \n${set.tablets.map((t: any) => `- ${t.name}`).join('\n')}\nTotal Predicted Score: ${Math.round(set.totalScore)}`;
        navigator.clipboard.writeText(text);
    };

    const getMetaMods = (item: any) => {
        const targetIds = strategy?.targetModIds || [];
        return POE2_MODS_DATABASE.filter(mod =>
            item.originalText.toLowerCase().includes(mod.text.toLowerCase())
        ).map(mod => ({
            ...mod,
            isTarget: targetIds.includes(mod.id)
        }));
    };

    const waystoneMeta = getMetaMods(set.waystone);
    const isWaystoneGodRoll = waystoneMeta.filter(m => m.isTarget).length >= 2;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: rank * 0.1 }}
            className={`group relative bg-slate-900 border border-slate-800 rounded-2xl lg:rounded-[2rem] overflow-hidden hover:border-cyan-500/40 transition-all duration-500 ${hoveredItem ? 'z-50' : 'z-0'}`}
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
                                            onMouseEnter={(e) => handleMouseEnter(set.waystone, e)}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => triggerCopy(set.waystone.name, 'waystone')}
                                            className="text-lg sm:text-xl font-black text-white leading-tight hover:text-cyan-400 transition-colors cursor-pointer active:scale-95"
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

                            {/* Waystone Meta Badges */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {isWaystoneGodRoll && (
                                    <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-md flex items-center gap-1">
                                        <Sparkles size={10} className="text-amber-400 animate-pulse" />
                                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">God Roll</span>
                                    </div>
                                )}
                                {waystoneMeta.map(mod => (
                                    <div
                                        key={mod.id}
                                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tighter border flex items-center gap-1 ${mod.isTarget
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {mod.isTarget && <Check size={8} />}
                                        {mod.text.split(' ').slice(-2).join(' ')}
                                    </div>
                                ))}
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
                            return (
                                <motion.div
                                    key={`${tablet.id}-${tidx}`}
                                    className="p-4 sm:p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group/tablet hover:border-indigo-500/50 transition-all duration-300 flex items-center justify-between relative"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-indigo-500/10 group-hover/tablet:bg-indigo-500/40 transition-colors" />

                                    <div className="flex flex-col pl-2">
                                        <span className="text-[10px] font-black text-slate-600 uppercase mb-1 block">Slot {tidx + 1}</span>
                                        <div className="relative">
                                            <h6
                                                onMouseEnter={(e) => handleMouseEnter(tablet, e)}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => triggerCopy(tablet.name, tablet.id)}
                                                className="text-base lg:text-lg font-black text-slate-200 leading-tight hover:text-indigo-300 transition-colors cursor-pointer active:scale-95"
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
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {/* Tablet Meta Badges */}
                                            {(() => {
                                                const meta = getMetaMods(tablet);
                                                const isGod = meta.filter(m => m.isTarget).length >= 2;
                                                return (
                                                    <>
                                                        {isGod && (
                                                            <div className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded flex items-center gap-0.5">
                                                                <Sparkles size={8} className="text-amber-400" />
                                                                <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">God</span>
                                                            </div>
                                                        )}
                                                        {meta.map(m => (
                                                            <div key={m.id} className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${m.isTarget ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                                                {m.text.includes('Quantity') ? 'Quantity' : m.text.includes('Rarity') ? 'Rarity' : m.text.includes('Pack') ? 'Pack Size' : m.text.includes('Logbooks') ? 'Logbooks' : 'Meta'}
                                                            </div>
                                                        ))}
                                                    </>
                                                );
                                            })()}
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
            {hoveredItem && (
                <ItemTooltip item={hoveredItem} mousePos={mousePos} strategy={strategy} />
            )}
        </motion.div>
    );
};

const ItemTooltip: React.FC<{ item: any, mousePos: { x: number, y: number }, strategy: any }> = ({ item, mousePos, strategy }) => {
    const targetIds = strategy?.targetModIds || [];

    // Process text to remove redundant info
    const text = item.originalText || item.rawText || '';
    const lines = text.split('\n')
        .filter((l: string) => !l.includes('--------'))
        .filter((l: string) => !l.includes('Item Class:'))
        .filter((l: string) => !l.includes('Rarity:'))
        .slice(0, 15);

    const getModHighlight = (line: string) => {
        const foundMod = POE2_MODS_DATABASE.find(m =>
            line.toLowerCase().includes(m.text.toLowerCase())
        );
        if (!foundMod) return null;
        return {
            isTarget: targetIds.includes(foundMod.id),
            mod: foundMod
        };
    };

    const detectedTags = useMemo(() => {
        const tags = new Set<string>();
        POE2_MODS_DATABASE.forEach(modDef => {
            if (item.originalText?.toLowerCase().includes(modDef.text.toLowerCase())) {
                modDef.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags);
    }, [item]);

    const isNearTop = mousePos.y < 450;
    const isNearRight = window.innerWidth - mousePos.x < 320;
    const isNearLeft = mousePos.x < 200;

    const transformX = isNearRight ? '-100%' : isNearLeft ? '0%' : '-50%';
    const transformY = isNearTop ? '15px' : 'calc(-100% - 15px)';

    return (
        <div
            style={{
                position: 'fixed',
                top: `${mousePos.y}px`,
                left: `${mousePos.x}px`,
                pointerEvents: 'none',
                zIndex: 9999,
                transform: `translate(${transformX}, ${transformY})`,
            }}
            className="w-[320px] max-h-[85vh] bg-slate-900/98 border border-slate-700 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] p-4 backdrop-blur-xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pointer-events-none"
        >
            <div className="flex flex-col gap-2">
                <div className="border-b border-slate-800 pb-2 mb-2">
                    <div className="flex justify-between items-start mb-1">
                        <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{item.type}</div>
                        <div className="flex gap-1">
                            {detectedTags.map(tag => (
                                <span key={tag} className="px-1 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[7px] font-black text-indigo-400 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm font-black text-white leading-tight">{item.name}</div>
                </div>
                <div className="space-y-1.5">
                    {lines.map((line: string, idx: number) => {
                        const highlight = getModHighlight(line);
                        const isMainStat = line.includes(':') && !line.includes('(');

                        if (highlight) {
                            return (
                                <div key={idx} className={`text-[11px] leading-relaxed p-1 rounded border flex items-center gap-1.5 ${highlight.isTarget
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-black'
                                    : 'bg-amber-500/5 border-amber-500/20 text-amber-300 font-bold'
                                    }`}>
                                    <Sparkles size={8} className={highlight.isTarget ? 'animate-pulse' : ''} />
                                    {line}
                                </div>
                            );
                        }

                        return (
                            <div key={idx} className={`text-[11px] leading-relaxed px-1 ${isMainStat ? 'text-slate-400 font-bold italic' : 'text-slate-500'}`}>
                                {line}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Click to copy name</span>
            </div>
        </div>
    );
};
