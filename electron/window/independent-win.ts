import path from 'node:path';
import { GLWins } from '../../shared/global-manager/wins';
import { devToolsEnable } from '../../shared/configs';
import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';

export function createIndependentWindow(
  routePath: string,
  options?: Partial<Electron.BrowserWindowConstructorOptions>
) {
  if (GLWins.independentWin) {
    if (process.env['VITE_DEV_SERVER_URL']) {
      GLWins.independentWin.loadURL(`${process.env['VITE_DEV_SERVER_URL']}#${routePath}`);
    } else {
      GLWins.independentWin.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'), {
        hash: routePath
      });
    }
    GLWins.independentWin.show();
    return;
  }

  GLWins.independentWin = new BrowserWindow({
    ...options,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      ...options?.webPreferences,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: devToolsEnable,
      preload: path.join(fileURLToPath(import.meta.url), '..', 'preload.mjs')
    }
  });

  GLWins.independentWin.on('close', () => {
    GLWins.independentWin = null;
  });

  GLWins.independentWin.webContents.on('destroyed', () => {
    GLWins.independentWin?.close();
  });

  if (process.env['VITE_DEV_SERVER_URL']) {
    GLWins.independentWin.loadURL(`${process.env['VITE_DEV_SERVER_URL']}#${routePath}`);
  } else {
    GLWins.independentWin.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'), {
      hash: routePath
    });
  }
}
