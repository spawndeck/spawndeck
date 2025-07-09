import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  
  win.loadURL('http://localhost:5173/').catch(() => {
    win.loadURL('data:text/html,<h1>Please start dev server at localhost:5173</h1>')
  })
})

app.on('window-all-closed', () => {
  if (process.platform \!== 'darwin') app.quit()
})
EOF < /dev/null