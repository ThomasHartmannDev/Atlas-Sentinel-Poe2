import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export const TitleBar: React.FC = () => {
    const handleMinimize = () => {
        (window as any).electronAPI?.minimize();
    };

    const handleMaximize = () => {
        (window as any).electronAPI?.maximize();
    };

    const handleClose = () => {
        (window as any).electronAPI?.close();
    };

    return (
        <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none z-50 shrink-0">
            {/* Draggable Area */}
            <div className="flex-1 h-full flex items-center px-4 gap-3 cursor-default" style={{ WebkitAppRegion: 'drag' } as any}>
                <img src="logo.png" alt="Atlas Sentinel Logo" className="w-5 h-5 object-contain mix-blend-screen" />
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">
                        Atlas Sentinel
                    </span>
                    <span className="text-[10px] text-indigo-500/60 font-bold tracking-normal">
                        by Thomas Hartmann
                    </span>
                </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center h-full no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={handleMinimize}
                    className="h-full px-4 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                    title="Minimize"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="h-full px-4 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                    title="Maximize"
                >
                    <Square size={12} />
                </button>
                <button
                    onClick={handleClose}
                    className="h-full px-4 text-slate-500 hover:bg-rose-500 hover:text-white transition-colors"
                    title="Close"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
