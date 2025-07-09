const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { join } = require('path');
const url = require('url');

const terminals = new Map();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        titleBarStyle: 'hiddenInset',
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
    createWindow();

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
    // Temporarily mock the terminal creation
    console.log('Creating terminal:', options.id);
    terminals.set(options.id, { id: options.id, pty: null });

    // Send some mock data
    setTimeout(() => {
        event.sender.send(`terminal:data:${options.id}`, 'Welcome to Spawndeck Terminal!\r\n$ ');
    }, 100);

    return { success: true };
});

ipcMain.handle('terminal:write', (event, { id, data }) => {
    const terminal = terminals.get(id);
    if (terminal) {
        // Echo the data back for now
        event.sender.send(`terminal:data:${id}`, data);
        if (data === '\r') {
            event.sender.send(`terminal:data:${id}`, '\n$ ');
        }
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:resize', (event, { id, cols, rows }) => {
    const terminal = terminals.get(id);
    if (terminal) {
        // Mock resize for now
        console.log(`Resizing terminal ${id} to ${cols}x${rows}`);
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:kill', (event, { id }) => {
    const terminal = terminals.get(id);
    if (terminal) {
        // Mock kill for now
        console.log(`Killing terminal ${id}`);
        terminals.delete(id);
        return { success: true };
    }
    return { success: false, error: 'Terminal not found' };
});