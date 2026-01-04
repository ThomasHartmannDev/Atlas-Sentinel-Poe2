/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        onClipboardUpdate: (callback: (text: string) => void) => () => void;
    }
}
