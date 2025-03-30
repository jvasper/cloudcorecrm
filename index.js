const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql')

let mainWindow;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'u2849689_default',
    password: 'Xpa6yfhDzGL9DI20',
    database: 'u2849689_default'
});
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
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function readSettings() {
    return new Promise((resolve, reject) => {
        let settings = [];
        
        db.query('SELECT * FROM accounts', [], function (e, r) {
            if (e) {
                reject('Error fetching settings: ' + e); // Reject promise if there's an error
            } else {
                settings.push(r);
                resolve(settings); // Resolve the promise with the settings when the query is done
                console.log(settings)
            }
        });
    });
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