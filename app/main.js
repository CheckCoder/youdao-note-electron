const { app, BrowserWindow, ipcMain, remote, Tray, Menu, shell} = require('electron');
const path = require('path');

const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;
let tray = null;
let appIcon = path.join(__dirname, '/res/icon/app-icon.png');

function initialize () {

    function createWindow () {
        const windowOptions = {
            // width: 900,
            // height: 450,
            fullscreen: false,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true
            },
            icon: appIcon
        }

        if (process.platform === 'darwin') {
            app.dock.setIcon(appIcon);
        }
    
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, '/windows/main/index.html'));
        mainWindow.maximize();

        mainWindow.on('maximize', () => {
            mainWindow.webContents.send('changeWindowSize', 'restore');
        });
        mainWindow.on('unmaximize', () => {
            mainWindow.webContents.send('changeWindowSize', 'maximize');
        });

        if (debug) {
            mainWindow.webContents.openDevTools();
        }
    }

    function setTray () {
        tray = new Tray(appIcon);
        const contextMenu = Menu.buildFromTemplate([
            { 
                label: '退出',
                click: () => {
                    app.quit();
                }
            }
        ]);
        tray.setToolTip('有道云笔记');
        tray.on('click', () => {
            if (mainWindow.isMinimized()) {
                mainWindow.maximize();
            } else {
                mainWindow.show();
            }
        });
        tray.setContextMenu(contextMenu);
    }

    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (mainWindow) {
                mainWindow.show();
            }
        });
    
        app.on('ready', () => {
            createWindow();
            setTray();
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

        // 使用默认浏览器打开链接
        app.on('web-contents-created', (e, webContents) => {
            webContents.on('new-window', (event, url) => {
                event.preventDefault();
                shell.openExternal(url);
            });
        });
        
        app.commandLine.appendSwitch('disable-site-isolation-trials');
    }
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
            let page = args[1] || '';
            if (page === 'main') {
                mainWindow.hide();
            } else {
                mainWindow.close();
                mainWindow = null;
                app.quit();
            }
            break;
        case 'intoLoginPage':
            mainWindow.restore();
            mainWindow.setSize(894, 450);
            // mainWindow.setResizable(false);
            break;
        case 'intoMainPage':
            mainWindow.setResizable(true);
            mainWindow.maximize();
            break;
    }
});