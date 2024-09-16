import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { GlobalHexo } from '../../shared/global-manager/hexo';
import { GLWins, type IGLMainWin } from '../../shared/global-manager/wins';
import { importProjectByDrop } from '../services/project/import-project';
import { devToolsVisible, devToolsEnable } from '../../shared/configs';
import { randomUUID } from 'crypto';
import logger from '../../shared/service-utils/logger';
import path from 'node:path';

export function createMainWindow(projectPath?: string) {
  const current: IGLMainWin = {
    id: `${Date.now()}-${randomUUID()}`,
    hexo: new GlobalHexo(),
    win: new BrowserWindow({
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
    })
  };

  current.win?.on('close', () => {
    current.hexo?.exit('the window was closed');
  });

  current.win?.on('closed', () => {
    GLWins.removeMainWin(current.id);
    if (BrowserWindow.getAllWindows().length === 0) {
      app.quit();
    }
  });

  current.win?.webContents.on('did-finish-load', async () => {
    const platformInfo = {
      sep: path.sep,
      platform: process.platform
    };
    current.win?.webContents.send(
      IPC_CHANNEL.MAIN_PROCESS_START,
      current.id,
      new Date().toLocaleString(),
      platformInfo
    );
    if (!projectPath && process.argv.length < 2) {
      return;
    }
    const directoryPath = projectPath || process.argv[1];
    logger(`[StartWithArgv]: path: ${directoryPath} - argv:${JSON.stringify(process.argv)}`);
    if (directoryPath === '.') {
      return;
    }
    const rs = await importProjectByDrop(current.id, directoryPath);
    current.win?.webContents.send(IPC_CHANNEL.IMPORT_PROJECT_BY_DROP_REPLY, rs);
  });

  current.win?.webContents.on('destroyed', () => {
    current.win?.destroy();
    current.hexo?.exit('the webContents was destroyed');
  });

  if (process.env['VITE_DEV_SERVER_URL']) {
    current.win?.loadURL(process.env['VITE_DEV_SERVER_URL']);
    devToolsEnable && devToolsVisible && current.win?.webContents.openDevTools();
  } else if (process.env.RENDERER_DIST) {
    current.win?.loadFile(path.join(process.env.RENDERER_DIST, 'index.html'));
  }

  GLWins.addMainWin(current);
}
