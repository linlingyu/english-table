import { app, Display, screen, BrowserWindow, Rectangle } from "electron";
import path from "path";

app.whenReady().then(() => {
    const display: Display = screen.getPrimaryDisplay(),
        workArea: Rectangle = display.workArea,
        win: BrowserWindow = new BrowserWindow({
            ...workArea,
            center: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
                // devTools: true // set true when debug
            }
        });
    // 
    win.loadFile(path.join(app.getAppPath(), 'out', 'electron-browser', 'index.html'));
    win.webContents.openDevTools();
    // win.loadFile(path.join(__dirname, 'index.html'));
});