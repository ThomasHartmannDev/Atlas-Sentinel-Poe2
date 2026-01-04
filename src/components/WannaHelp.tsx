import React from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Github,
    MessageSquare,
    Code2,
    Lightbulb,
    ExternalLink,
    Coffee,
    Bug
} from 'lucide-react';
import clsx from 'clsx';

export const WannaHelp: React.FC = () => {
    const methods = [
        {
            title: "Report Bugs",
            icon: Bug,
            color: "text-rose-400",
            bg: "bg-rose-400/10",
            description: "Found a weird interaction or a crash? Let us know so we can squash it.",
            action: "Open Issue",
            url: "https://github.com/ThomasHartmannDev/Atlas-Sentinel-Poe2/issues"
        },
        {
            title: "Suggest Ideas",
            icon: Lightbulb,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            description: "Have a brilliant strategy or a UI improvement in mind? We love new perspectives.",
            action: "Share Idea",
            url: "https://github.com/ThomasHartmannDev/Atlas-Sentinel-Poe2/issues"
        },
        {
            title: "Contribute Code",
            icon: Code2,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
            description: "Know your way around React and Electron? Feel free to open a Pull Request.",
            action: "Fork Repo",
            url: "https://github.com/ThomasHartmannDev/Atlas-Sentinel-Poe2"
        },
        {
            title: "Join Discussion",
            icon: MessageSquare,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            description: "Connect with other exiles using the tool and share your farming setups.",
            action: "GitHub Discussions",
            url: "https://github.com/ThomasHartmannDev/Atlas-Sentinel-Poe2/discussions"
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 w-full overflow-hidden">
            <header className="px-10 py-10 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md relative z-10 shrink-0">
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                            <Heart className="text-rose-400 animate-pulse" size={32} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                                Wanna <span className="text-rose-500">Help?</span>
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                                Join the Atlas Sentinel community & development
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-10 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto w-full space-y-12 pb-20">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {methods.map((method, idx) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all duration-500 flex flex-col justify-between"
                            >
                                <div>
                                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border", method.bg, "border-white/5")}>
                                        <method.icon className={method.color} size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{method.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-8">
                                        {method.description}
                                    </p>
                                </div>
                                <a
                                    href={method.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 hover:border-indigo-500/30"
                                >
                                    <Github size={18} />
                                    {method.action}
                                    <ExternalLink size={14} className="opacity-40" />
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Community Banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] p-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                            <Coffee size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                            <div className="p-6 bg-indigo-500/20 rounded-full shrink-0 outline outline-4 outline-indigo-500/10">
                                <Github size={48} className="text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white mb-2 tracking-tighter italic uppercase">Open Source & Free Forever</h4>
                                <p className="text-slate-300 font-medium leading-relaxed max-w-2xl">
                                    Atlas Sentinel is a non-profit tool created for the community. The best way to help is by spreading the word and contributing to our GitHub repository.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
