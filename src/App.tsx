import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Analysis } from './components/Analysis';
import { Optimizer } from './components/Optimizer';
import { AtlasGuide } from './components/AtlasGuide';
import { useStore } from './store';
import { HowToUse } from './components/HowToUse';
import { TitleBar } from './components/TitleBar';
import type { ParsedItem } from './types';
import Worker from './workers/parser.worker?worker';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const { addItem, isMonitoring, validateState } = useStore();
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
        workerRef.current.postMessage(text);
      }
    });

    return () => {
      cleanup();
    };
  }, [isMonitoring]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'optimizer':
        return <Optimizer />;
      case 'atlas-guide':
        return <AtlasGuide />;
      case 'settings':
        return <Settings />;
      case 'analysis':
        return <Analysis />;
      case 'how-to-use':
        return <HowToUse />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
