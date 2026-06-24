const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 320,
        height: 180,
        frame: false, // Frameless window
        transparent: true, // Transparent background to allow custom CSS rounded corners
        alwaysOnTop: true, // Floats like a widget
        resizable: true,
        minWidth: 250,
        minHeight: 150,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    ipcMain.removeAllListeners('close-app');
    ipcMain.removeAllListeners('minimize-app');

    ipcMain.on('close-app', () => {
        app.quit();
    });

    ipcMain.on('minimize-app', () => {
        mainWindow.minimize();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
