import { app, Display, screen, BrowserWindow, Rectangle } from "electron";
import path from "path";
import { menu } from "./menu";

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
    menu.initialize(win);
    // win.loadFile(path.join(app.getAppPath(), 'out', 'electron-browser', 'index.html'));
    win.loadFile(path.join(__dirname, 'electron-browser', 'index.html'));
    win.webContents.openDevTools();
});