import { BrowserWindow } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { fileURLToPath } from 'url';
import { devToolsVisible } from '../../shared/configs';
import path from 'path';

export function createMainWindow() {
  GLWins.mainWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      preload: path.join(fileURLToPath(import.meta.url), '..', 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: devToolsVisible
    }
  });

  // Test active push message to Renderer-process.
  GLWins.mainWin.webContents.on('did-finish-load', () => {
    GLWins.mainWin?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  GLWins.mainWin.on('close', () => {
    GLWins.mainWin = null;
  });

  if (process.env['VITE_DEV_SERVER_URL']) {
    GLWins.mainWin.loadURL(process.env['VITE_DEV_SERVER_URL']);
    devToolsVisible && GLWins.mainWin.webContents.openDevTools();
  } else if (process.env.RENDERER_DIST) {
    GLWins.mainWin.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'));
  }
}
