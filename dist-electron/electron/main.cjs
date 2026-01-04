"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
let mainWindow;
let lastClipboardText = '';
// Set AppUserModelId for Windows taskbar grouping
if (process.platform === 'win32') {
    electron_1.app.setAppUserModelId('com.poe2.atlassentinel');
}
const REPO_URL = 'ThomasHartmannDev/Atlas-Sentinel-Poe2';
const CURRENT_VERSION = '1.1.0';
/**
 * Checks GitHub for a newer release.
 */
function checkForUpdates() {
    console.log('Main: Checking for updates...');
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${REPO_URL}/releases/latest`,
        headers: {
            'User-Agent': 'Atlas-Sentinel-App'
        }
    };
    https_1.default.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const release = JSON.parse(data);
                if (release && release.tag_name) {
                    const latestVersion = release.tag_name.replace('v', '');
                    console.log(`Main: Local version: ${CURRENT_VERSION}, Latest on GitHub: ${latestVersion}`);
                    if (latestVersion !== CURRENT_VERSION && mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('update-available', {
                            version: latestVersion,
                            url: release.html_url,
                            notes: release.body
                        });
                    }
                }
            }
            catch (e) {
                console.error('Main: Failed to parse GitHub release data:', e);
            }
        });
    }).on('error', (err) => {
        console.error('Main: Update check failed:', err);
    });
}
function startClipboardPoll() {
    setInterval(() => {
        try {
            const text = electron_1.clipboard.readText();
            if (text && text !== lastClipboardText) {
                lastClipboardText = text;
                // Heuristic: only send if it looks like a PoE item (contains "Rarity:" or "Item Class:")
                // This reduces IPC noise and fixes some issues with other apps
                const isPoE = text.includes('Rarity:') || text.includes('Item Class:') || text.includes('Classe de Item:') || text.includes('Raridade:');
                if (isPoE && mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('clipboard-update', text);
                }
            }
        }
        catch (err) {
            console.error('Clipboard poll error:', err);
        }
    }, 500); // 500ms is a bit more conservative but reliable
}
function createWindow() {
    const iconPath = process.env.NODE_ENV === 'development'
        ? path_1.default.join(electron_1.app.getAppPath(), 'public', 'logo.png')
        : path_1.default.join(electron_1.app.getAppPath(), 'dist', 'logo.png');
    const image = electron_1.nativeImage.createFromPath(iconPath);
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 700,
        icon: image,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: "PoE 2 Atlas Sentinel",
        backgroundColor: '#0f172a', // Slate-900
        autoHideMenuBar: true,
        frame: false,
    });
    electron_1.ipcMain.on('window-minimize', () => {
        mainWindow?.minimize();
    });
    electron_1.ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow?.maximize();
        }
    });
    electron_1.ipcMain.on('window-close', () => {
        mainWindow?.close();
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        // mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(electron_1.app.getAppPath(), 'dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    startClipboardPoll();
    // Check for updates shortly after startup
    setTimeout(checkForUpdates, 5000);
    // And then every hour
    setInterval(checkForUpdates, 1000 * 60 * 60);
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.cjs.map