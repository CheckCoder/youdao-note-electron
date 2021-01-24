const { app, BrowserWindow, ipcMain, remote} = require('electron');
const path = require('path');

const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;

function initialize () {

    function createWindow () {
        const windowOptions = {
            width: 900,
            height: 450,
            fullscreen: false,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true
            }
        }
    
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, '/windows/main/index.html'));

        mainWindow.on('maximize', () => {
            mainWindow.webContents.send('changeWindowSize', 'restore');
        });
        mainWindow.on('unmaximize', () => {
            mainWindow.webContents.send('changeWindowSize', 'maximize');
        });
        // mainWindow.on('resize', () => {
        //     if (mainWindow.isMaximized()) {
        //         // 最大化
                
        //     } else {
        //         // 非最大化
        //         mainWindow.webContents.send('changeWindowSize', 'maximize');
        //     }
        // });

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

ipcMain.handle('mainPageEvent', (evidence, ...args) => {
    let type = args[0];
    switch (type) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'maximize':
            mainWindow.maximize();
            break;
        case 'resize':
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            } else {
                mainWindow.maximize();
            }
            break;
        case 'close':
            mainWindow.close();
            mainWindow = null;
            break;
        case 'intoLoginPage':
            mainWindow.restore();
            mainWindow.setSize(894, 450);
            break;
    }
});