import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const AtlasGuide: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-10 bg-[#0f172a]">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-8"
                >
                    <div className="inline-flex p-8 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
                        <Clock className="w-20 h-20 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase mb-4">
                            Coming Soon!
                        </h2>
                        <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                            We are currently crafting in-depth visual guides and passive tree recommendations for every strategy. Stay tuned!
                        </p>
                    </div>

                    <div className="pt-8 flex flex-wrap justify-center gap-6 opacity-30 grayscale pointer-events-none">
                        <div className="h-2 w-32 bg-slate-800 rounded-full" />
                        <div className="h-2 w-48 bg-slate-800 rounded-full" />
                        <div className="h-2 w-24 bg-slate-800 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
