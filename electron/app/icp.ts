import Store from 'electron-store';
import path from 'node:path';
import initIPCStoreEvent from '../store';
import initIPCEditorEvent from '../editor/events';
import { dialog, ipcMain, nativeTheme, type OpenDialogOptions } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv, getEnvPath } from '../../shared/service-utils';
import { createIndependentWindow } from '../window/independent-win';
import { GLIPCEventHandled } from '../../shared/global-manager/vars';
import { createProject } from '../services/project/create-project';
import { importProject, importProjectByDrop } from '../services/project/import-project';
import { type ICreateProjectOptions } from '../../shared/utils/types';

export default function initIPCEvent(store: Store) {
  if (GLIPCEventHandled.current) {
    return;
  }

  initIPCStoreEvent(store);

  initIPCEditorEvent();

  ipcMain.handle(IPC_CHANNEL.CHANGE_THEME, (_, theme: 'light' | 'dark' | 'system') => {
    nativeTheme.themeSource = theme;
  });

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, (_, envPath?: string) => {
    return checkEnv(envPath);
  });

  ipcMain.on(IPC_CHANNEL.CHECK_ENV, async (_, replyToWinId: string, envPath?: string) => {
    const rs = await checkEnv(envPath);
    GLWins.getMainWin(replyToWinId)?.win?.webContents?.send(
      IPC_CHANNEL.CHECK_ENV_FROM_OTHERS_PAGE,
      rs
    );
  });

  ipcMain.handle(IPC_CHANNEL.GET_ENV_PATH, () => {
    return getEnvPath();
  });

  ipcMain.handle(IPC_CHANNEL.CHOOSE_DIRECTORY, async (_, options: Partial<OpenDialogOptions>) => {
    const rs = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory', ...(options?.properties ?? [])]
    });
    Reflect.set(rs, 'sep', path.sep);
    return rs;
  });

  ipcMain.handle(IPC_CHANNEL.CHOOSE_FILE, async (_, options: Partial<OpenDialogOptions>) => {
    const rs = await dialog.showOpenDialog({
      ...options,
      properties: ['openFile', ...(options?.properties ?? [])]
    });
    Reflect.set(rs, 'sep', path.sep);
    return rs;
  });

  ipcMain.handle(
    IPC_CHANNEL.IMPORT_PROJECT,
    (_, winId: string, options: Partial<OpenDialogOptions>) => {
      return importProject(winId, options);
    }
  );

  ipcMain.handle(IPC_CHANNEL.IMPORT_PROJECT_BY_DROP, (_, winId: string, projectPath: string) => {
    return importProjectByDrop(winId, projectPath);
  });

  ipcMain.handle(
    IPC_CHANNEL.OPEN_INDEPENDENT_WINDOW,
    (_, routePath: string, options?: Partial<Electron.BrowserWindowConstructorOptions>) => {
      return createIndependentWindow(routePath, options);
    }
  );

  ipcMain.handle(IPC_CHANNEL.CLOSE_WINDOW, (event) => {
    event.sender.close();
  });

  ipcMain.handle(
    IPC_CHANNEL.CREATE_PROJECT,
    (event, winId: string, options: ICreateProjectOptions) => {
      return createProject(winId, options, event);
    }
  );

  GLIPCEventHandled.current = true;
}
