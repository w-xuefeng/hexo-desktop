import { BrowserWindow } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { fileURLToPath } from 'url';
import path from 'path';

const devToolsVisible = true;
// const devToolsVisible =
//   !!process.env['VITE_DEV_SERVER_URL'];

export function createMainWindow() {
  GLWins.mainWin = new BrowserWindow({
    icon: path.join(
      process.env.VITE_PUBLIC,
      'logo.svg'
    ),
    webPreferences: {
      preload: path.join(
        fileURLToPath(import.meta.url),
        '..',
        'preload.mjs'
      ),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: devToolsVisible
    }
  });

  // Test active push message to Renderer-process.
  GLWins.mainWin.webContents.on(
    'did-finish-load',
    () => {
      GLWins.mainWin?.webContents.send(
        'main-process-message',
        new Date().toLocaleString()
      );
    }
  );

  if (process.env['VITE_DEV_SERVER_URL']) {
    GLWins.mainWin.loadURL(
      process.env['VITE_DEV_SERVER_URL']
    );
    devToolsVisible &&
      GLWins.mainWin.webContents.openDevTools();
  } else if (process.env.RENDERER_DIST) {
    GLWins.mainWin.loadFile(
      path.join(
        process.env.RENDERER_DIST,
        'index.html'
      )
    );
  }
}
