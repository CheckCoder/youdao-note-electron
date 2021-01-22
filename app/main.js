const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;

function initialize () {

    function createWindow () {
        const windowOptions = {
            width: 945,
            height: 450,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true
            }
        }
    
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, '/windows/main/index.html'));
        mainWindow.maximize();

        if (debug) {
            mainWindow.webContents.openDevTools();
        }
    }


    app.on('ready', () => {
        createWindow();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
    
    app.commandLine.appendSwitch('disable-site-isolation-trials');
}

initialize();

ipcMain.handle('handleTopIconClick', (evidence, ...args) => {
    let type = args[0];
    switch (type) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'close':
            mainWindow.close();
            mainWindow = null;
            break;
    }
});