const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
	resizable: false,
	
  })

  win.loadFile('index.html')
	//win.removeMenu()
}

app.whenReady().then(() => {
	
  createWindow()
	
})

