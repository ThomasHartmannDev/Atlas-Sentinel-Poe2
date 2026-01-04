"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    onClipboardUpdate: (callback) => {
        const listener = (_event, text) => callback(text);
        electron_1.ipcRenderer.on('clipboard-update', listener);
        return () => {
            electron_1.ipcRenderer.removeListener('clipboard-update', listener);
        };
    },
    minimize: () => electron_1.ipcRenderer.send('window-minimize'),
    maximize: () => electron_1.ipcRenderer.send('window-maximize'),
    close: () => electron_1.ipcRenderer.send('window-close'),
    onUpdateAvailable: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('update-available', listener);
        return () => electron_1.ipcRenderer.removeListener('update-available', listener);
    }
});
//# sourceMappingURL=preload.cjs.map