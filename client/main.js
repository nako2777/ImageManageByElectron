const { app, BrowserWindow,Menu,ipcMain } = require('electron/main')
const contextMenuOptions = require('./useByMain/menu')
const api = require('./useByMain/api')
const path = require('node:path')
let win = {};
// レンダラーから今選択されてるデータを保存する
let pathList = [];
let selectedFiles = [];
createWindow = ()=> {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  this.win = win;
  //コンテクストメニューを初期化する
  const options = contextMenuOptions(win,this);
  const contextMenu = Menu.buildFromTemplate(options)
  const initEvent = () =>{
    win.webContents.on('context-menu', (e,params) =>{ 
      contextMenu.popup()
    })
  }
  
  initEvent();
}

selectedFiles = (event,pathList,files) =>{
  this.pathList = pathList;
  this.selectedFiles = files;
}

function ipcInit(){
  ipcMain.handle('selectedFiles',selectedFiles)
}

app.whenReady().then(() => {
  createWindow()
  ipcInit();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


