import React from 'react';
import { BarChart3, Settings, TrendingUp, Map as MapIcon, Archive, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const items = [
        { id: 'dashboard', icon: Archive, label: 'Stash' },
        { id: 'optimizer', icon: TrendingUp, label: 'Optimizer' },
        { id: 'atlas-guide', icon: MapIcon, label: 'Strategy Guide' },
        { id: 'analysis', icon: BarChart3, label: 'Archive' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'how-to-use', icon: HelpCircle, label: 'How to Use' },
    ];

    return (
        <div className="w-72 bg-slate-900 h-screen flex flex-col py-8 border-r border-slate-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
            {/* Branding */}
            <div className="flex items-center gap-3 mb-16 px-8 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
                <div className="relative">
                    <img src="logo.png?v=4" alt="Atlas Sentinel Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] mix-blend-screen brightness-125 saturate-150" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-white tracking-tighter leading-none">
                        ATLAS<span className="text-indigo-500">SENTINEL</span>
                    </h1>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none mt-1">Optimization Core</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 w-full px-4 space-y-1.5">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={clsx(
                                'relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden',
                                isActive
                                    ? 'bg-indigo-500/10 text-white'
                                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                                />
                            )}
                            <Icon className={clsx(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-indigo-400"
                            )} />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer Status */}
            <div className="mt-auto px-8 py-4">
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Health</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">Stable Build • v1.0.0</div>
                </div>
            </div>
        </div>
    );
};
