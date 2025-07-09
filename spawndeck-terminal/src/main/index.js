const { app, BrowserWindow, ipcMain, shell, globalShortcut } = require('electron');
const { join } = require('path');
const url = require('url');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');

const terminals = new Map();
let mainWindow;

// Settings management
const settingsPath = path.join(app.getPath('userData'), 'settings.json');
let settings = {
    theme: 'default',
    shortcuts: {
        newTab: 'CommandOrControl+T'
    }
};

function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 20, y: 20 },
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            contextIsolation: true
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // Load the local HTML file
    const indexPath = url.format({
        pathname: join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
    });
    
    mainWindow.loadURL(indexPath);
    
    // Open DevTools in development
    if (process.env.NODE_ENV !== 'production') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    loadSettings();
    createWindow();

    // Register global shortcuts
    globalShortcut.register(settings.shortcuts.newTab, () => {
        if (mainWindow) {
            mainWindow.webContents.send('shortcut:newTab');
        }
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
});

// Terminal IPC handlers
ipcMain.handle('terminal:create', (event, options) => {
    console.log('Creating terminal:', options.id);
    
    const shell = process.platform === 'win32' 
        ? 'powershell.exe' 
        : process.env.SHELL || '/bin/bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: options.cols || 80,
        rows: options.rows || 30,
        cwd: process.env.HOME,
        env: process.env
    });

    const terminal = {
        id: options.id,
        pty: ptyProcess
    };

    terminals.set(options.id, terminal);

    // Handle data from the pty
    ptyProcess.onData((data) => {
        event.sender.send(`terminal:data:${options.id}`, data);
    });

    // Handle pty exit
    ptyProcess.onExit(() => {
        terminals.delete(options.id);
        event.sender.send(`terminal:exit:${options.id}`);
    });

    return { success: true };
});

ipcMain.handle('terminal:write', (event, { id, data }) => {
    const terminal = terminals.get(id);
    if (terminal && terminal.pty) {
        terminal.pty.write(data);
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:resize', (event, { id, cols, rows }) => {
    const terminal = terminals.get(id);
    if (terminal && terminal.pty) {
        terminal.pty.resize(cols, rows);
        console.log(`Resizing terminal ${id} to ${cols}x${rows}`);
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:kill', (event, { id }) => {
    const terminal = terminals.get(id);
    if (terminal && terminal.pty) {
        console.log(`Killing terminal ${id}`);
        terminal.pty.kill();
        terminals.delete(id);
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});

// Settings IPC handlers
ipcMain.handle('settings:get', () => {
    return settings;
});

ipcMain.handle('settings:save', (event, newSettings) => {
    settings = { ...settings, ...newSettings };
    saveSettings();
    
    // Re-register shortcuts if they changed
    globalShortcut.unregisterAll();
    globalShortcut.register(settings.shortcuts.newTab, () => {
        if (mainWindow) {
            mainWindow.webContents.send('shortcut:newTab');
        }
    });
    
    return { success: true };
});