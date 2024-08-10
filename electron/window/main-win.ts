import { BrowserWindow } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from '../../shared/global-manager/vars';
import { fileURLToPath } from 'url';
import path from 'path';

const devToolsVisible = !!VITE_DEV_SERVER_URL;

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

  if (VITE_DEV_SERVER_URL) {
    GLWins.mainWin.loadURL(VITE_DEV_SERVER_URL);
    devToolsVisible && GLWins.mainWin.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    GLWins.mainWin.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}
