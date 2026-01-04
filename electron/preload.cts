import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onClipboardUpdate: (callback: (text: string) => void) => {
        const listener = (_event: any, text: string) => callback(text);
        ipcRenderer.on('clipboard-update', listener);
        return () => {
            ipcRenderer.removeListener('clipboard-update', listener);
        };
    },
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    onUpdateAvailable: (callback: (data: { version: string, url: string, notes: string }) => void) => {
        const listener = (_event: any, data: any) => callback(data);
        ipcRenderer.on('update-available', listener);
        return () => ipcRenderer.removeListener('update-available', listener);
    }
});
