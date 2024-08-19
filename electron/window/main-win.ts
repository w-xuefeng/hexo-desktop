import { BrowserWindow } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { fileURLToPath } from 'url';
import { devToolsVisible, devToolsEnable } from '../../shared/configs';
import path from 'path';

export function createMainWindow() {
  GLWins.mainWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    width: 850,
    height: 600,
    minWidth: 850,
    minHeight: 600,
    webPreferences: {
      preload: path.join(fileURLToPath(import.meta.url), '..', 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: devToolsEnable
    }
  });

  GLWins.mainWin.on('close', () => {
    GLWins.mainWin = null;
  });

  GLWins.mainWin.webContents.on('did-finish-load', () => {
    GLWins.mainWin?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  GLWins.mainWin.webContents.on('destroyed', () => {
    GLWins.mainWin?.close();
  });

  if (process.env['VITE_DEV_SERVER_URL']) {
    GLWins.mainWin.loadURL(process.env['VITE_DEV_SERVER_URL']);
    devToolsEnable && devToolsVisible && GLWins.mainWin.webContents.openDevTools();
  } else if (process.env.RENDERER_DIST) {
    GLWins.mainWin.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'));
  }
}
