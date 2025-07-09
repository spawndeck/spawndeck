const { app, BrowserWindow, ipcMain, shell, Menu, systemPreferences } = require('electron');
const { join } = require('path');
const url = require('url');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');

// Set app name
app.name = 'Spawndeck';

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
        trafficLightPosition: { x: 15, y: 15 },
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

function createMenu() {
    const template = [
        {
            label: app.name,
            submenu: [
                {
                    label: 'About ' + app.name,
                    role: 'about'
                },
                { type: 'separator' },
                {
                    label: 'Settings...',
                    accelerator: 'Command+,',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.send('menu:openSettings');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Hide ' + app.name,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Option+H',
                    role: 'hideOthers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                { type: 'separator' },
                {
                    label: 'Quit ' + app.name,
                    accelerator: 'Command+Q',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
                { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
                { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
                { type: 'separator' },
                { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
                { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
                { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
                { type: 'separator' },
                { label: 'Toggle Fullscreen', accelerator: 'Control+Command+F', role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Terminal',
            submenu: [
                {
                    label: 'New Tab',
                    accelerator: settings.shortcuts.newTab,
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.send('shortcut:newTab');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Clear',
                    accelerator: 'Command+K',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.send('menu:clearTerminal');
                        }
                    }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
                { type: 'separator' },
                { label: 'Bring All to Front', role: 'front' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://github.com/spawndeck/spawndeck');
                    }
                }
            ]
        }
    ];

    // Set menu for all platforms (will be in the menu bar on macOS)
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    loadSettings();
    createWindow();
    createMenu();

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

// Handle title bar double-click
ipcMain.on('titlebar-double-click', () => {
    if (process.platform === 'darwin') {
        const action = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');
        if (action === 'Minimize') {
            mainWindow.minimize();
        } else {
            // Default to maximize/restore (includes 'Maximize' and undefined)
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    }
});

// Settings IPC handlers
ipcMain.handle('settings:get', () => {
    return settings;
});

ipcMain.handle('settings:save', (event, newSettings) => {
    settings = { ...settings, ...newSettings };
    saveSettings();
    
    // Recreate menu to update shortcuts
    createMenu();
    
    return { success: true };
});