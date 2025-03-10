const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    login: (data) => ipcRenderer.invoke('login', data),
    getSettings: () => ipcRenderer.invoke('get-settings')
});