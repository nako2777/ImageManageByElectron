const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('fileProcessAPI',{
    selectedFiles:(pathList,files) => ipcRenderer.invoke('selectedFiles',pathList,files), 
    onReloadDir:(callback) => ipcRenderer.on('reloadDir',() => callback())
})