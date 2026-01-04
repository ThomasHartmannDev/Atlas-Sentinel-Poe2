import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings as SettingsIcon, RefreshCcw, Trash2, Database, Sliders, Plus, Download, Upload, Palette, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LABELS: Record<string, string> = {
    quantity: 'Item Quantity',
    rarity: 'Item Rarity',
    packSize: 'Monster Pack Size',
    gold: 'Gold Found',
    delirium: 'Delirium Chance',
    corruptionBonus: 'Corruption Bonus',
    magicMonsters: 'Magic Monsters',
    rareMonsters: 'Rare Monsters',
    expGain: 'Experience Gain'
};

const DESCRIPTION_LIMIT = 80;

export const Settings: React.FC = () => {
    const {
        weights,
        updateWeights,
        clearItems,
        customStrategies,
        addCustomStrategy,
        removeCustomStrategy
    } = useStore();

    const [isCreating, setIsCreating] = useState(false);
    const [importText, setImportText] = useState('');
    const [newProfile, setNewProfile] = useState({
        name: '',
        description: '',
        color: '#6366f1'
    });

    const handleWeightChange = (key: keyof typeof weights, value: string) => {
        updateWeights({ [key]: parseFloat(value) });
    };

    const handleSaveProfile = () => {
        if (!newProfile.name) return;
        addCustomStrategy({
            ...newProfile,
            weights: { ...weights }
        });
        setNewProfile({ name: '', description: '', color: '#6366f1' });
        setIsCreating(false);
    };

    const handleExport = (id: string) => {
        const strat = customStrategies[id];
        const data = JSON.stringify(strat);
        navigator.clipboard.writeText(data);
        alert('Strategy data copied to clipboard!');
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (data.name && data.weights) {
                addCustomStrategy(data);
                setImportText('');
                alert('Strategy imported successfully!');
            }
        } catch (e) {
            alert('Invalid strategy data');
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0f172a] w-full">
            <header className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            <SettingsIcon className="text-cyan-400 w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight italic">Settings</h2>
                            <p className="text-slate-400 font-medium italic">Configure optimization weights and custom profiles</p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 custom-scrollbar">
                <div className="max-w-[1600px] mx-auto w-full space-y-12 pb-10">
                    {/* Scoring Weights Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-[0.2em] text-sm">
                                <Sliders size={18} />
                                Scoring Weights
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={14} />
                                Create Profile from Weights
                            </button>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-8 backdrop-blur-xl">
                            {(Object.entries(weights) as [keyof typeof weights, number][])
                                .filter(([key]) => LABELS[key])
                                .map(([key, val]) => (
                                    <div key={key} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {LABELS[key] || key}
                                            </label>
                                            <span className="text-xl font-black text-white tabular-nums">{val}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            step="1"
                                            value={val}
                                            onChange={(e) => handleWeightChange(key, e.target.value)}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>
                                ))}
                        </div>
                    </section>

                    <AnimatePresence>
                        {isCreating && (
                            <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-[2rem] p-8">
                                    <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <Plus className="text-indigo-400" />
                                        New Custom Profile
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                                <Type size={12} /> Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newProfile.name}
                                                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold"
                                                placeholder="e.g. My Fast Farm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                                <Palette size={12} /> Color
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={newProfile.color}
                                                    onChange={(e) => setNewProfile({ ...newProfile, color: e.target.value })}
                                                    className="w-12 h-12 bg-transparent border-none p-0 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={newProfile.color}
                                                    onChange={(e) => setNewProfile({ ...newProfile, color: e.target.value })}
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                                    <AlignLeft size={12} /> Description
                                                </label>
                                                <span className={`text-[10px] font-bold ${newProfile.description.length > DESCRIPTION_LIMIT ? 'text-rose-400' : 'text-slate-600'}`}>
                                                    {newProfile.description.length}/{DESCRIPTION_LIMIT}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={DESCRIPTION_LIMIT}
                                                value={newProfile.description}
                                                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm"
                                                placeholder="What is this for?"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={!newProfile.name}
                                            className="px-8 py-3 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50"
                                        >
                                            Save Profile
                                        </button>
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="px-8 py-3 bg-slate-800 text-slate-400 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Custom Profiles List */}
                    {Object.keys(customStrategies).length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold uppercase tracking-[0.2em] text-sm">
                                <Plus size={18} />
                                Custom Profiles
                            </div>
                            <div className="space-y-4">
                                {Object.entries(customStrategies).map(([id, strat]) => (
                                    <div key={id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: strat.color }} />
                                            <div>
                                                <h4 className="font-black text-white uppercase tracking-wider">{strat.name}</h4>
                                                <p className="text-slate-500 text-xs italic">{strat.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleExport(id)}
                                                className="p-3 bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"
                                                title="Export Strategy"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => removeCustomStrategy(id)}
                                                className="p-3 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                                                title="Delete Strategy"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Import Strategy */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">
                            <Upload size={18} />
                            Import Strategy
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col gap-4 backdrop-blur-xl">
                            <textarea
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                placeholder="Paste exported strategy JSON here..."
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-400 font-mono text-xs h-24 focus:border-emerald-500/50 focus:outline-none transition-all"
                            />
                            <button
                                onClick={handleImport}
                                disabled={!importText}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                            >
                                <Upload size={20} />
                                Deploy Imported Strategy
                            </button>
                        </div>
                    </section>

                    {/* Data Management Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-rose-400 font-bold uppercase tracking-[0.2em] text-sm">
                            <Database size={18} />
                            Data & Persistence
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Clear Local Storage</h4>
                                <p className="text-slate-500 text-sm max-w-sm">
                                    This will permanently remove all scanned items. Use with caution.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure? This will delete all scanned data.")) {
                                        clearItems();
                                        window.location.reload();
                                    }
                                }}
                                className="flex items-center gap-3 px-6 py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-rose-500/5"
                            >
                                <Trash2 size={20} />
                                Wipe Data
                            </button>
                        </div>
                    </section>

                    <footer className="pt-10 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Engine Active v1.1.0
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCcw size={10} />
                            Patch: Jan 2026
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};
