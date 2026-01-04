import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STRATEGIES, type StrategyName } from '../lib/strategies';
import { useStore } from '../store';
import clsx from 'clsx';

interface StrategySelectorProps {
    activeColor?: string; // Optional override for the active border/text color
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ activeColor = 'indigo' }) => {
    const { activeStrategy, setStrategy, customStrategies } = useStore();
    const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null);

    const renderStrategy = (id: string, name: string, description: string, color: string) => {
        const isActive = activeStrategy === id;
        return (
            <div
                key={id}
                className="relative group"
                onMouseEnter={() => setHoveredStrategy(id)}
                onMouseLeave={() => setHoveredStrategy(null)}
            >
                <button
                    onClick={() => setStrategy(id)}
                    className={clsx(
                        "relative w-full flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 overflow-hidden",
                        isActive
                            ? `bg-slate-800 border-${activeColor}-500/50 shadow-lg`
                            : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    )}
                >
                    {isActive && (
                        <motion.div
                            layoutId="strat-glow-global"
                            className={clsx(
                                "absolute inset-0 blur-xl pointer-events-none",
                                `bg-${activeColor}-500/5`
                            )}
                        />
                    )}
                    <span
                        className="w-2 h-2 rounded-full mb-1"
                        style={{ backgroundColor: color }}
                    />
                    <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1",
                        isActive ? `text-${activeColor}-400` : "text-slate-500 group-hover:text-slate-300"
                    )}>
                        {name}
                    </span>
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredStrategy === id && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl pointer-events-none"
                        >
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1" style={{ color: color }}>
                                {name}
                            </div>
                            <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                                {description}
                            </p>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Built-in strategies */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {(Object.keys(STRATEGIES) as StrategyName[]).map((sName) => {
                    const strat = STRATEGIES[sName];
                    return renderStrategy(sName, strat.name, strat.description, strat.color);
                })}
            </div>

            {/* Custom Strategies row */}
            {Object.keys(customStrategies).length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-px flex-1 bg-slate-800/50" />
                        <span className="text-[10px] uppercase font-black text-slate-600 tracking-tighter">Custom Profiles</span>
                        <div className="h-px flex-1 bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                        {Object.entries(customStrategies).map(([id, strat]) =>
                            renderStrategy(id, strat.name, strat.description, strat.color)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
