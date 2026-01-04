import React, { useState } from 'react';
import { useStore } from '../store';
import { Sparkles, Plus, Download, Trash2, CheckCircle2, Sliders, RefreshCcw, Shield, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { POE2_MODS_DATABASE } from '../lib/mods_database';

const TAG_LABELS: Record<string, { label: string, icon: string }> = {
    efficiency: { label: 'Irradiated (Efficiency)', icon: 'zap' },
    gold: { label: 'Gold Farming', icon: 'coins' },
    rarity: { label: 'Unique Hunting', icon: 'sparkles' },
    xp: { label: 'Experience Focus', icon: 'trending-up' },
    monsters: { label: 'Monster Density', icon: 'users' },
    drops: { label: 'Loot Quantity', icon: 'package' },
    expedition: { label: 'Expedition (Logbooks)', icon: 'map' },
    breach: { label: 'Breach (Splinters)', icon: 'portal' },
    delirium: { label: 'Delirium (Clusters)', icon: 'cloud' },
    ritual: { label: 'Ritual (Omens)', icon: 'vibrate' },
    abyss: { label: 'Abyss (Jewels)', icon: 'hole' },
    boss: { label: 'Boss Fragments', icon: 'skull' }
};

export const JuicingLab: React.FC = () => {
    const {
        customStrategies,
        addCustomStrategy,
        removeCustomStrategy
    } = useStore();

    const [isCreating, setIsCreating] = useState(false);
    const [importText, setImportText] = useState('');
    const [newProfile, setNewProfile] = useState({
        name: '',
        description: '',
        color: '#6366f1',
        targetModIds: [] as string[],
        tagWeights: { efficiency: 1.0 } as Record<string, number>,
        synergyMultiplier: 1.2,
        leagueLoyalty: 1.5,
        mixMastery: 1.5
    });

    const handleSaveProfile = () => {
        if (!newProfile.name) return;
        addCustomStrategy(newProfile);
        setNewProfile({
            name: '',
            description: '',
            color: '#6366f1',
            targetModIds: [],
            tagWeights: { efficiency: 1.0 },
            synergyMultiplier: 1.2,
            leagueLoyalty: 1.5,
            mixMastery: 1.5
        });
        setIsCreating(false);
    };

    const toggleModInProfile = (modId: string) => {
        setNewProfile((prev: any) => ({
            ...prev,
            targetModIds: prev.targetModIds.includes(modId)
                ? prev.targetModIds.filter((id: string) => id !== modId)
                : [...prev.targetModIds, modId]
        }));
    };

    const handleExport = (id: string) => {
        const strat = customStrategies[id];
        const data = JSON.stringify(strat);
        navigator.clipboard.writeText(data);
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (data.name && data.tagWeights) {
                if (data.leagueLoyalty === undefined) data.leagueLoyalty = 1.5;
                if (data.mixMastery === undefined) data.mixMastery = 1.5;
                addCustomStrategy(data);
                setImportText('');
            }
        } catch (e) {
            console.error('Import failed', e);
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
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <FlaskConical className="text-indigo-400 w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight italic">Juicing Lab</h2>
                            <p className="text-slate-400 font-medium italic">Engineer your custom farming mechanical cockatils</p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 custom-scrollbar">
                <div className="max-w-[1600px] mx-auto w-full space-y-12 pb-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-[0.2em] text-sm">
                                <Sparkles size={18} />
                                Profile Engineering
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={14} />
                                Create New Profile
                            </button>
                        </div>
                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] p-8 backdrop-blur-xl">
                            <p className="text-slate-400 text-sm leading-relaxed italic">
                                Define your priorities. Use <span className="text-indigo-400 font-bold">League Loyalty</span> for pure meta (3 identical tablets) or <span className="text-amber-400 font-bold">Mix Mastery</span> for modular cocktails (Ritual + Delirium + Irradiated).
                            </p>
                        </div>
                    </section>

                    <AnimatePresence>
                        {isCreating && (
                            <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-[2rem] p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Name</label>
                                            <input
                                                type="text"
                                                value={newProfile.name}
                                                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold"
                                                placeholder="e.g. Triple Abyss Meta"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Color</label>
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
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Description</label>
                                            <input
                                                type="text"
                                                value={newProfile.description}
                                                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm"
                                                placeholder="What is this cocktail for?"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
                                        <div className="lg:col-span-2 space-y-4">
                                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                <Sliders size={12} /> Tag Priorities
                                            </label>
                                            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-6 space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {Object.entries(TAG_LABELS).map(([tagId, { label }]) => (
                                                    <div key={tagId} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
                                                            <span className="text-xs font-black text-indigo-400">x{(newProfile.tagWeights[tagId] || 1).toFixed(1)}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="3"
                                                            step="0.1"
                                                            value={newProfile.tagWeights[tagId] || 1}
                                                            onChange={(e) => setNewProfile(p => ({
                                                                ...p,
                                                                tagWeights: { ...p.tagWeights, [tagId]: parseFloat(e.target.value) }
                                                            }))}
                                                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                <RefreshCcw size={12} /> Synergy Multiplier
                                            </label>
                                            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-6 h-fit">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-medium text-slate-400 italic">Matching boost?</span>
                                                    <span className="text-2xl font-black text-emerald-400">{(newProfile.synergyMultiplier).toFixed(1)}x</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1.0"
                                                    max="2.5"
                                                    step="0.1"
                                                    value={newProfile.synergyMultiplier}
                                                    onChange={(e) => setNewProfile(p => ({ ...p, synergyMultiplier: parseFloat(e.target.value) }))}
                                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                                <Shield size={12} /> League Loyalty
                                            </label>
                                            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-6 h-fit">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-medium text-slate-400 italic">Pure Meta?</span>
                                                    <span className="text-2xl font-black text-cyan-400">{(newProfile.leagueLoyalty).toFixed(1)}x</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1.0"
                                                    max="3.0"
                                                    step="0.1"
                                                    value={newProfile.leagueLoyalty}
                                                    onChange={(e) => setNewProfile(p => ({ ...p, leagueLoyalty: parseFloat(e.target.value) }))}
                                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                                <FlaskConical size={12} /> Mix Mastery
                                            </label>
                                            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-6 h-fit">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-medium text-slate-400 italic">Cocktail Mix?</span>
                                                    <span className="text-2xl font-black text-amber-400">{(newProfile.mixMastery).toFixed(1)}x</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1.0"
                                                    max="3.0"
                                                    step="0.1"
                                                    value={newProfile.mixMastery}
                                                    onChange={(e) => setNewProfile(p => ({ ...p, mixMastery: parseFloat(e.target.value) }))}
                                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                            <Plus size={12} /> Target Mods
                                        </label>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[250px]">
                                            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                                {['Waystone', 'Tablet'].map(type => (
                                                    <div key={type} className="space-y-3">
                                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800 pb-1">{type} Modifiers</h4>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {POE2_MODS_DATABASE.filter(m => m.type === type || m.type === 'Both').map(mod => (
                                                                <button
                                                                    key={mod.id}
                                                                    onClick={() => toggleModInProfile(mod.id)}
                                                                    className={`text-left p-2 rounded-lg border text-[10px] transition-all flex items-start justify-between gap-3 ${newProfile.targetModIds.includes(mod.id)
                                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                                                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700'
                                                                        }`}
                                                                >
                                                                    <span className="font-medium">{mod.text}</span>
                                                                    {newProfile.targetModIds.includes(mod.id) && <CheckCircle2 size={12} className="text-indigo-400 shrink-0" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 flex flex-col h-full">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Selected Mods ({newProfile.targetModIds.length})</h4>
                                                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 mb-4">
                                                    {newProfile.targetModIds.map(id => {
                                                        const mod = POE2_MODS_DATABASE.find(m => m.id === id);
                                                        return mod ? (
                                                            <div key={id} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-lg group">
                                                                <span className="text-[10px] text-slate-300 font-bold">{mod.text}</span>
                                                                <button onClick={() => toggleModInProfile(id)} className="p-1 hover:text-rose-400 transition-colors">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
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
                                Custom Juice Profiles
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(customStrategies).map(([id, strat]: [string, any]) => (
                                    <div key={id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-center justify-between gap-6 backdrop-blur">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: strat.color }} />
                                            <div>
                                                <h4 className="font-black text-white uppercase tracking-wider">{strat.name}</h4>
                                                <p className="text-slate-500 text-xs italic">{strat.description}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[7px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-black">Syn: {strat.synergyMultiplier.toFixed(1)}x</span>
                                                    <span className="text-[7px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-black">Loy: {strat.leagueLoyalty.toFixed(1)}x</span>
                                                    <span className="text-[7px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase font-black">Mix: {strat.mixMastery.toFixed(1)}x</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleExport(id)}
                                                className="p-2.5 bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"
                                                title="Export Strategy"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeCustomStrategy(id)}
                                                className="p-2.5 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                                                title="Delete Strategy"
                                            >
                                                <Trash2 size={16} />
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
                            <Plus size={18} />
                            Biological Import
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
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300 disabled:opacity-50 group"
                            >
                                <Sparkles size={20} className="group-hover:animate-spin" />
                                Deploy Juicing Profile
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
