const { app, Menu, BrowserWindow} = require('electron');

function createWindow () {
    const win = new BrowserWindow({
        width: 945,
        height: 450,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            webSecurity: false
        }
    });
    win.maximize();
    win.loadFile('./app/windows/main/index.html');
    win.webContents.openDevTools();
}

app.commandLine.appendSwitch('disable-site-isolation-trials');
app.whenReady().then(createWindow);
// app.on('activate', () => {
//     createWindow();
// });