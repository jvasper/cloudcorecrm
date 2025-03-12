const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        title: "CloudCore CRM",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.setMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function readSettings() {
    const settingsPath = path.join(__dirname, 'settings.json');
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
}

ipcMain.handle('login', async (event, { username, password }) => {
    try {
        const data = readSettings();
        const user = data.accounts.find(acc => acc.login === username && acc.password === password);

        if (user) {
            mainWindow.loadFile('dashboard.html');
            return { success: true, message: "Успешный вход", user };
        } else {
            return { success: false, message: "Неверный логин или пароль" };
        }
    } catch (e) {
        return { success: false, message: "Ошибка при загрузке файла настроек" };
    }
});

ipcMain.handle('get-settings', async () => {
    return readSettings();
});