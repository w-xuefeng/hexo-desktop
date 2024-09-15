import path from 'node:path';
import { GLWins } from '../../shared/global-manager/wins';
import { devToolsEnable } from '../../shared/configs';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';

export function loadIndependentWin(
  win: BrowserWindow,
  routePath: string,
  combineSymbol: string,
  search: string
) {
  if (process.env['VITE_DEV_SERVER_URL']) {
    const url = new URL(process.env['VITE_DEV_SERVER_URL']);
    url.hash = `${routePath}${combineSymbol}${search}`;
    win.loadURL(url.toString());
  } else {
    win.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'), {
      hash: `${routePath}${combineSymbol}${search}`
    });
  }
}

export function createIndependentWindow(
  routePath: string,
  options?: Partial<Electron.BrowserWindowConstructorOptions> & { query?: Record<string, any> }
) {
  const { query, ...otherOptions } = options || {};

  const search = query ? new URLSearchParams(query).toString() : '';
  const combineSymbol = search ? '?' : '';

  if (GLWins.independentWin) {
    loadIndependentWin(GLWins.independentWin, routePath, combineSymbol, search);
    GLWins.independentWin.show();
    return;
  }

  GLWins.independentWin = new BrowserWindow({
    ...otherOptions,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      ...otherOptions?.webPreferences,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: devToolsEnable,
      preload: path.join(fileURLToPath(import.meta.url), '..', 'preload.mjs')
    }
  });

  GLWins.independentWin?.webContents.on('did-finish-load', async () => {
    const platformInfo = {
      sep: path.sep,
      platform: process.platform
    };
    GLWins.independentWin?.webContents.send(
      IPC_CHANNEL.INDEPENDENT_WIN_START,
      new Date().toLocaleString(),
      platformInfo
    );
  });

  GLWins.independentWin.on('close', () => {
    GLWins.independentWin = null;
  });

  GLWins.independentWin.webContents.on('destroyed', () => {
    GLWins.independentWin?.setClosable(true);
    GLWins.independentWin?.close();
  });

  loadIndependentWin(GLWins.independentWin, routePath, combineSymbol, search);
}
