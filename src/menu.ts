import { app, BrowserWindow, Menu, MenuItem, dialog } from "electron";
import { service } from "./service";
//
function onSwitchMode(menuItem: MenuItem, browserWindow: BrowserWindow | undefined) {
    if (!browserWindow) {
        return;
    }
    // 
    browserWindow.webContents.send('SWITCH_MODE', {
        mode: menuItem.id
    });
}
// 
function onExport(menuItem: MenuItem, browserWindow: BrowserWindow | undefined) {
    if (!browserWindow) {
        return;
    }
    dialog.showSaveDialog(browserWindow, {
        title: 'Save Data',
        showsTagField: false
    }).then((value: Electron.SaveDialogReturnValue) => {
        if (!value.filePath) {
            return;
        }
        // 
        service.export(value.filePath, browserWindow);
    });
}
function onImport(menuItem: MenuItem, browserWindow: BrowserWindow | undefined) {
    if (!browserWindow) {
        return;
    }
    // 
    dialog.showOpenDialog(browserWindow, {
        title: 'Import Data',
        properties: ['openFile', 'createDirectory']
    }).then((value: Electron.OpenDialogReturnValue) => {
        if (!value.filePaths.length) {
            return;
        }
        service.import(value.filePaths[0], browserWindow);
    });
}
// 
const menuInstance = Menu.buildFromTemplate([{
    label: app.name,
    submenu: [
        {
            role: 'about',
            label: 'About Englist Table'
        },
        {type: 'separator'},
        {role: 'close'}
    ]
}, {
    label: 'File',
    submenu: [
        {
            label: 'Import Data',
            click: onImport
        },
        {type: 'separator'},
        {
            label: 'Export Data',
            click: onExport
        },
        {type: 'separator'}
    ]
}, {
    label: 'Mode',
    submenu: [{
        id: 'view',
        type: 'radio',
        label: `View Mode`,
        checked: true,
        click: onSwitchMode
    }, {
        id: 'edit',
        type: 'radio',
        label: 'Edit Mode',
        click: onSwitchMode
    }]
}]);
// 
export const menu = {
    initialize(browserWindow: BrowserWindow) {
        service.initializeEvent(browserWindow);
        Menu.setApplicationMenu(menuInstance);
    }
}