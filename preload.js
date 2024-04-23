const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  runScript: () => ipcRenderer.send('run-script'),
  addItem: (newItem) => ipcRenderer.send('add-item', newItem),
  onItemAdded: (callback) => ipcRenderer.on('item-added', (event, newItem) => callback(newItem)),
  updateItemValue: (itemId, field, val) => ipcRenderer.send('update-item', itemId, field, val),
  updateCategory: (selectedItem, selectedCategory, itemId) => ipcRenderer.send('update-category', selectedItem, selectedCategory, itemId),
  onRefreshPDF: (callback) => ipcRenderer.on('refresh-pdf', (event, savePath) => callback(savePath)),
  savePath: (pathText) => ipcRenderer.send('save-path', (pathText)),
})