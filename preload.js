const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    login: (data) => ipcRenderer.invoke('login', data),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    getDialogInfo: (id) => ipcRenderer.invoke('getDialogInfo', id),
    regBuy: (buyerId, items) => ipcRenderer.invoke('regBuy', buyerId, items),
    addBuyer: (data) => ipcRenderer.invoke('addBuyer', data),
    saveAllItems: (editingItem) => ipcRenderer.invoke('saveAllItems', editingItem),
    getUserData: () => ipcRenderer.invoke('getUserData'),
});