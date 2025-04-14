const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql')

let mainWindow;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cloudecrm'
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

function getDatabaseData() {
    return new Promise((resolve, reject) => {
        let result = {};
        db.query('SHOW TABLES', [], function (e, tables) {
            if (e) {
                return reject('Error fetching table names: ' + e);
            }
            let tablePromises = tables.map((tableObj) => {
                let tableName = tableObj[`Tables_in_${db.config.database}`];

                return new Promise((tableResolve, tableReject) => {
                    db.query(`SELECT * FROM ${tableName}`, [], function (err, rows) {
                        let formattedRows = rows.map(row => {
                            let formattedRow = {};
                            for (let column in row) {
                                formattedRow[column] = row[column];
                            }
                            return formattedRow;
                        });

                        result[tableName] = formattedRows;
                        tableResolve();
                    });
                });
            });

            Promise.all(tablePromises)
                .then(() => resolve(result))
                .catch(reject);
        });
    });
}

let userLogin
ipcMain.handle('login', async (event, { username, password }) => {
    try {
        // Получаем данные из базы данных асинхронно
        let data = await getDatabaseData();

        // Находим пользователя в данных
        const user = data.accounts.find(acc => acc.login === username && acc.password === password);
        userLogin = user
        if (user) {
            // Если пользователь найден, загружаем новый файл
            mainWindow.loadFile('dashboard.html');
            return { success: true, message: "Успешный вход", user };
        } else {
            return { success: false, message: "Неверный логин или пароль" };
        }
    } catch (e) {
        // Обработка ошибок
        console.log(e);
        return { success: false, message: "Ошибка при загрузке файла настроек" };
    }
});
ipcMain.handle('getUserData', async () => {
    return userLogin;
});
ipcMain.handle('get-settings', async () => {
    try {
        const data = await getDatabaseData();
        data.receipts.forEach(element => {
            element.items = JSON.parse(element.items)
        });
        // console.log(data)
        return data;
    } catch (error) {
        console.error("Ошибка при получении настроек:", error);
        return { success: false, message: "Не удалось получить данные" };
    }
});
function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// ipcMain handler
ipcMain.handle('getDialogInfo', async (event, id) => {
    try {
        // Use the helper function to query the database
        const rows = await queryAsync('SELECT * FROM receipts WHERE id = ?', [id]);

        // Ensure there is at least one row in the result
        if (rows.length > 0) {
            // console.log(JSON.parse(rows[0].items)); // log the items
            return JSON.parse(rows[0].items); // return the parsed items
        } else {
            throw new Error('No receipt found with the given ID');
        }
    } catch (error) {
        console.error('Error querying the database:', error);
        throw error; // propagate the error back to the renderer
    }
});
ipcMain.handle('regBuy', async (event, data) => {
    console.log(data)
    db.query('INSERT INTO receipts (shifId, total, date, employee, items, buyerId, discount, toPaid, payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [data.shifId, data.total, data.date, data.employee, JSON.stringify(data.items), data.buyerId, data.discount, data.toPaid, data.payment], function (e, r) {
        db.query('SELECT * FROM shifts WHERE isOpen = 1', [], function (e, r) {
            db.query('UPDATE shifts SET sales = ?, generalReceipt = ? WHERE isOpen = 1', [r[0].sales + 1, r[0].generalReceipt + Number(data.toPaid)], function (e, r) {
                if (data.buyerId != -1) {
                    db.query('UPDATE buyers SET buys = buys + 1  WHERE id = 1', [, data.buyerId], function (e, r) {
                    });
                }
                data.items.forEach(element => {
                    db.query(`UPDATE items SET count = count - ${element.count} WHERE id = ?`, [element.id], function (e, r) {
                
                    }); 
                });
            })
        })
    })
});
ipcMain.handle('addBuyer', async (event, data) => {
    db.query('INSERT INTO buyers (buys, name, numberPhone, discount, bonuses, barcode) VALUES (?, ?, ?, ?, ?, ?)', [0, data.name, data.numberPhone, 5, 0, data.barcode], function (e, r) {
    });
});
ipcMain.handle('saveAllItems', async (event, editingItem) => {
    db.query('UPDATE items SET name = ?, price = ?, count = ?, barcode = ? WHERE id = ?', [editingItem.name, editingItem.price, editingItem.count, editingItem.barcode, editingItem.id])
});