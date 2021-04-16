import { BrowserWindow, dialog, ipcMain, IpcMainEvent, Notification } from "electron";
import fs from 'fs';

export const service = {
    initializeEvent(browserWindow: BrowserWindow) {
        ipcMain.on('EXPORT_DATA-REPLY', (event: IpcMainEvent, {filePath, data}) => {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
            dialog.showMessageBox(browserWindow, {
                message: 'The data has been saved.',
                type: 'info'
            });
        });
        ipcMain.on('IMPORT_DATA-REPLY', () => {
            browserWindow.reload();
            dialog.showMessageBox(browserWindow, {
                message: 'The data has been imported.',
                type: 'info'
            });
        });
    },

    export(filePath: string, browserWindow: BrowserWindow) {
        browserWindow.webContents.send('EXPORT_DATA', {filePath});
    },

    import(filePath: string, browserWindow: BrowserWindow) {
        const contentString: string = fs.readFileSync(filePath, 'utf-8');
        try {
            const data: any = JSON.parse(contentString);
            if (!data.tree || !data.word || !data.sentence) {
                throw Error('This file is not a data file!');
            }
            browserWindow.webContents.send('IMPORT_DATA', {data});
        } catch(error) {
            dialog.showMessageBox(browserWindow, {
                title: 'Error',
                message: error.message,
                type: 'error'
            });
        }
    }
};