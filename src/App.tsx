import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { JuicingLab } from './components/JuicingLab';
import { Analysis } from './components/Analysis';
import { Optimizer } from './components/Optimizer';
import { AtlasGuide } from './components/AtlasGuide';
import { useStore } from './store';
import { HowToUse } from './components/HowToUse';
import { WannaHelp } from './components/WannaHelp';
import { TitleBar } from './components/TitleBar';
import type { ParsedItem } from './types';
import Worker from './workers/parser.worker?worker';

import { Sparkles, Download, ExternalLink } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [updateInfo, setUpdateInfo] = useState<{ version: string, url: string } | null>(null);
  const { addItem, isMonitoring, activeStrategy, validateState } = useStore();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Reconcile legacy state on mount
    validateState();

    // Initializing worker once
    console.log('App: Initializing Worker...');
    workerRef.current = new Worker();

    workerRef.current.onmessage = (e) => {
      const result: ParsedItem | null = e.data;
      if (result) {
        addItem(result);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!(window as any).electronAPI) {
      console.warn('App: electronAPI not found. Clipboard monitoring disabled.');
      return;
    }

    const cleanup = (window as any).electronAPI.onClipboardUpdate((text: string) => {
      if (isMonitoring && workerRef.current) {
        workerRef.current.postMessage({ text, strategyName: activeStrategy });
      }
    });

    return () => {
      cleanup();
    };
  }, [isMonitoring, activeStrategy]);

  useEffect(() => {
    if ((window as any).electronAPI?.onUpdateAvailable) {
      return (window as any).electronAPI.onUpdateAvailable((data: any) => {
        console.log('App: Update available!', data);
        setUpdateInfo(data);
      });
    }
  }, []);



  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'optimizer':
        return <Optimizer />;
      case 'atlas-guide':
        return <AtlasGuide />;
      case 'juicing-lab':
        return <JuicingLab />;
      case 'settings':
        return <Settings />;
      case 'analysis':
        return <Analysis />;
      case 'how-to-use': return <HowToUse />;
      case 'wanna-help': return <WannaHelp />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          <AnimatePresence>
            {updateInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-indigo-600 border-b border-indigo-500 overflow-hidden shrink-0 z-30"
              >
                <div className="max-w-[1600px] mx-auto px-8 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">
                      New Update Available: <span className="opacity-80">v{updateInfo.version}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setUpdateInfo(null)}
                      className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Dismiss
                    </button>
                    <a
                      href={updateInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-1.5 bg-white text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg shadow-black/10"
                    >
                      <Download size={14} />
                      Download Now
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 overflow-hidden relative">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
