import React, { useState } from 'react';
import { useStore } from '../store';
import { BarChart3, Search, ArrowUpAz, ArrowDownZa, Eye, History, Trash2, Clock, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const Analysis: React.FC = () => {
    const { items, usageHistory, clearHistory } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'All' | 'Waystone' | 'Tablet'>('All');
    const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="h-full flex flex-col bg-[#0f172a] w-full">
            <header className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                <BarChart3 className="text-cyan-400 w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight">Archive</h2>
                                <p className="text-slate-400 font-medium italic">Track your inventory and execution history</p>
                            </div>
                        </motion.div>

                        <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 self-start">
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeTab === 'inventory' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <Layers size={14} />
                                Item Inventory
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeTab === 'history' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <History size={14} />
                                Usage History
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'inventory' ? (
                            <motion.div
                                key="inventory-filters"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col md:flex-row gap-4"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-indigo-500/50 outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1">
                                    {['All', 'Waystone', 'Tablet'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setTypeFilter(type as any)}
                                            className={clsx(
                                                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                typeFilter === type ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="history-filters"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex justify-between items-center"
                            >
                                <p className="text-slate-500 italic text-sm font-medium">Record of the last 100 executed optimizations.</p>
                                <button
                                    onClick={clearHistory}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Clear History
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-8">
                <div className="max-w-[1600px] mx-auto w-full h-full bg-slate-900/30 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-xl">
                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'inventory' ? (
                                <motion.div
                                    key="inventory-table"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full"
                                >
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Item Details</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Score</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tier</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Charges/Uses</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {filteredItems.map((item, idx) => (
                                                <motion.tr
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: idx * 0.01 }}
                                                    key={item.id}
                                                    className="hover:bg-slate-800/20 transition-colors group"
                                                >
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={clsx(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center border",
                                                                item.type === 'Waystone' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                                            )}>
                                                                {item.type === 'Waystone' ? <ArrowUpAz size={18} /> : <ArrowDownZa size={18} />}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">{item.name}</div>
                                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.type}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="text-xl font-black text-white tabular-nums">
                                                            {Math.round(item.score || 0)}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-300">{item.tier > 0 ? `Tier ${item.tier}` : 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            {item.type === 'Tablet' ? (
                                                                <div className="flex flex-col items-center justify-center bg-indigo-500/10 rounded-xl px-4 py-1 border border-indigo-500/20">
                                                                    <span className="text-xl font-black text-indigo-400 tabular-nums">{item.uses}</span>
                                                                    <span className="text-[8px] font-black uppercase text-indigo-500 leading-none">Uses</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-600">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredItems.length === 0 && (
                                        <div className="p-20 text-center opacity-30 flex flex-col items-center">
                                            <Eye size={48} className="mb-4" />
                                            <p className="font-black uppercase tracking-widest">No matching items found</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="history-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-8 space-y-4"
                                >
                                    {usageHistory.length === 0 ? (
                                        <div className="py-20 text-center opacity-30 flex flex-col items-center">
                                            <Clock size={48} className="mb-4" />
                                            <p className="font-black uppercase tracking-widest">No execution records found</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {usageHistory.map((entry, idx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    key={entry.id}
                                                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/30 transition-all group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400">
                                                            <span className="text-[8px] font-black uppercase leading-none mb-1">Score</span>
                                                            <span className="text-lg font-black leading-none">{Math.round(entry.score)}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest italic">{entry.strategy}</span>
                                                                <span className="text-[10px] text-slate-700">•</span>
                                                                <span className="text-xs font-bold text-slate-500 uppercase">{new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}</span>
                                                            </div>
                                                            <h4 className="text-xl font-black text-white italic group-hover:text-indigo-400 transition-colors">
                                                                {entry.waystoneName}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {entry.tablets.map((tablet, tidx) => (
                                                            <div
                                                                key={`${tablet.id}-${tidx}`}
                                                                className="px-3 py-1.5 bg-slate-800/50 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 flex items-center gap-2"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                                {tablet.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};
