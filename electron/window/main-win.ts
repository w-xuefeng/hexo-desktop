import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { GLHexo } from '../../shared/global-manager/hexo';
import { GLWins } from '../../shared/global-manager/wins';
import { importProjectByDrop } from '../services/project/import-project';
import { devToolsVisible, devToolsEnable } from '../../shared/configs';
import logger from '../../shared/service-utils/logger';
import path from 'path';

export function createMainWindow(projectPath?: string) {
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
    GLHexo.exit();
    GLWins.mainWin = null;
    if (BrowserWindow.getAllWindows().length === 0) {
      app.quit();
    }
  });

  GLWins.mainWin.webContents.on('did-finish-load', async () => {
    GLWins.mainWin?.webContents.send(IPC_CHANNEL.MAIN_PROCESS_START, new Date().toLocaleString());
    if (!projectPath && process.argv.length < 2) {
      return;
    }
    const directoryPath = projectPath || process.argv[1];
    logger(`[StartWithArgv]: path: ${directoryPath} - argv:${JSON.stringify(process.argv)}`);
    if (directoryPath === '.') {
      return;
    }
    const rs = await importProjectByDrop(directoryPath);
    GLWins.mainWin?.webContents.send(IPC_CHANNEL.IMPORT_PROJECT_BY_DROP_REPLY, rs);
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
