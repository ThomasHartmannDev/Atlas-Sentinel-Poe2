import React from 'react';
import { useStore } from '../store';
import { Settings as SettingsIcon, Trash2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
    const {
        clearItems
    } = useStore();

    const handleResetAll = () => {
        if (window.confirm("Are you sure? This will permanently delete all scanned items and your history. Your custom profiles will be kept.")) {
            clearItems();
            window.location.reload();
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
                        <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                            <SettingsIcon className="text-rose-400 w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight italic">Settings</h2>
                            <p className="text-slate-400 font-medium italic">Global application preferences and data management</p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto w-full space-y-12 pb-10">

                    {/* Data Management */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-rose-400 font-bold uppercase tracking-[0.2em] text-sm">
                            <ShieldAlert size={18} />
                            Data & Persistence
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1 tracking-tight">Wipe Stash Data</h4>
                                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                                    Permanently remove all scanned Waystones and Tablets. This action is irreversible.
                                </p>
                            </div>
                            <button
                                onClick={handleResetAll}
                                className="flex items-center gap-3 px-8 py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-rose-500/5 w-full md:w-auto justify-center"
                            >
                                <Trash2 size={20} />
                                Wipe Data
                            </button>
                        </div>
                    </section>


                </div>
            </main>
        </div>
    );
};
