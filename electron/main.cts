import { app, BrowserWindow, clipboard, ipcMain, nativeImage } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null;
let lastClipboardText = '';

// Set AppUserModelId for Windows taskbar grouping
if (process.platform === 'win32') {
    app.setAppUserModelId('com.poe2.atlassentinel');
}

function startClipboardPoll() {
    setInterval(() => {
        const text = clipboard.readText();
        if (text && text !== lastClipboardText) {
            lastClipboardText = text;
            // Simple heuristic to avoid spamming non-PoE text: check for key phrases
            // But for now, just send everything and let renderer filter
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('clipboard-update', text);
            }
        }
    }, 500);
}

function createWindow() {
    const iconPath = process.env.NODE_ENV === 'development'
        ? path.join(app.getAppPath(), 'public', 'logo.png')
        : path.join(app.getAppPath(), 'dist', 'logo.png');

    const image = nativeImage.createFromPath(iconPath);

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 700,
        icon: image,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: "PoE 2 Atlas Sentinel",
        backgroundColor: '#0f172a', // Slate-900
        autoHideMenuBar: true,
        frame: false,
    });

    ipcMain.on('window-minimize', () => {
        mainWindow?.minimize();
    });

    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });

    ipcMain.on('window-close', () => {
        mainWindow?.close();
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    startClipboardPoll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
