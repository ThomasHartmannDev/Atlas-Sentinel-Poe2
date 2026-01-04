import React from 'react';
import { motion } from 'framer-motion';
import {
    HelpCircle,
    BookOpen,
    Zap,
    Archive,
    TrendingUp,
    MousePointer2,
    Shield,
    Sparkles,
    CheckCircle2,
    FlaskConical,
    Keyboard
} from 'lucide-react';
import clsx from 'clsx';

export const HowToUse: React.FC = () => {
    const sections = [
        {
            title: "Quick Start: Clipboard Sync",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20",
            steps: [
                {
                    text: "Open Path of Exile 2 and navigate to your stash.",
                    icon: Shield
                },
                {
                    text: "Hover over any Waystone or Tablet and use Ctrl + C (the default PoE copy command).",
                    icon: Keyboard
                },
                {
                    text: "Atlas Sentinel will automatically detect, parse, and score the item based on your active strategy.",
                    icon: Sparkles
                }
            ]
        },
        {
            title: "The Stash (Your Inventory)",
            icon: Archive,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
            border: "border-indigo-400/20",
            description: "Manage your collected items here. View scores, stats, and delete items you no longer need.",
            tips: [
                "Click on an item's name to quickly copy it to your clipboard for ingame searching.",
                "The app monitors your clipboard for items. Just make sure the 'Active' indicator is on."
            ]
        },
        {
            title: "Juicing Lab & Profiles",
            icon: FlaskConical,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            border: "border-cyan-400/20",
            description: "Engineer your custom farming cockatils and manage scoring profiles.",
            steps: [
                { text: "Select a Strategy in the top selector to change how items are scored.", icon: MousePointer2 },
                { text: "Go to Juicing Lab to create custom profiles with specific Tag Weights and Target Mods.", icon: FlaskConical },
                { text: "Higher League Loyalty = Pure Meta. Higher Mix Mastery = Hybrid Cocktails.", icon: TrendingUp }
            ]
        },
        {
            title: "The Optimizer",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/20",
            description: "The engine that finds your best possible Waystone + Tablet combinations.",
            tips: [
                "The Optimizer automatically finds sets that yield the highest possible Score.",
                "It prioritizes synergy—matching Tablet stats with your Strategy's priorities.",
                "Clicking 'Execute Set' will permanently archive the items, keeping your workspace clean."
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 w-full overflow-hidden">
            <header className="px-10 py-10 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md relative z-10 shrink-0">
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                            <HelpCircle className="text-indigo-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tighter">
                                HOW TO <span className="text-indigo-500">USE</span>
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                                Complete manual for Atlas Sentinel Optimization
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-10">
                <div className="max-w-[1200px] mx-auto w-full space-y-12 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sections.map((section, idx) => (
                            <motion.section
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={clsx(
                                    "p-8 rounded-[2.5rem] bg-slate-900/40 border transition-all duration-500",
                                    section.border
                                )}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={clsx("p-3 rounded-2xl border", section.bg, section.border)}>
                                        <section.icon className={section.color} size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">{section.title}</h3>
                                </div>

                                {section.description && (
                                    <p className="text-slate-400 font-medium mb-6 leading-relaxed">
                                        {section.description}
                                    </p>
                                )}

                                {section.steps && (
                                    <div className="space-y-4 mb-2">
                                        {section.steps.map((step, sIdx) => (
                                            <div key={sIdx} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-indigo-500 transition-colors">
                                                        {sIdx + 1}
                                                    </div>
                                                    {sIdx < section.steps.length - 1 && (
                                                        <div className="w-px flex-1 bg-slate-800 my-1" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.tips && (
                                    <div className="space-y-3">
                                        {section.tips.map((tip, tIdx) => (
                                            <div key={tIdx} className="flex gap-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                                <p className="text-xs font-bold text-slate-400 leading-normal">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.section>
                        ))}
                    </div>

                    {/* Pro Tip Banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10"
                    >
                        <div className="p-6 bg-indigo-500/20 rounded-full shrink-0">
                            <BookOpen size={48} className="text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Expert Advice</h4>
                            <p className="text-slate-300 font-medium leading-relaxed max-w-2xl">
                                Always keep Atlas Sentinel open on your secondary monitor. The real-time scoring allows you to evaluate your drops immediately without leaving the game flow.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
