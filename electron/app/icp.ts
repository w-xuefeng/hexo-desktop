import Store from 'electron-store';
import path from 'node:path';
import initIPCStoreEvent from '../store';
import { dialog, ipcMain, type OpenDialogOptions } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv } from '../../shared/service-utils';
import importProject from '../services/project/import-project';
import { createProject, openCreateProjectPanel } from '../services/project/create-project';
import { type ICreateProjectOptions } from '../../shared/utils/types';

export default function initIPCEvent(store: Store) {
  initIPCStoreEvent(store);

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, () => {
    return checkEnv();
  });

  ipcMain.handle(IPC_CHANNEL.CHOOSE_DIRECTORY, async (_, options: Partial<OpenDialogOptions>) => {
    const rs = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory']
    });
    Reflect.set(rs, 'sep', path.sep);
    return rs;
  });

  ipcMain.handle(IPC_CHANNEL.IMPORT_PROJECT, (_, options: Partial<OpenDialogOptions>) => {
    return importProject(options);
  });

  ipcMain.handle(
    IPC_CHANNEL.OPEN_CREATE_PROJECT,
    (_, routePath: string, options?: Partial<Electron.BrowserWindowConstructorOptions>) => {
      return openCreateProjectPanel(routePath, options);
    }
  );

  ipcMain.handle(IPC_CHANNEL.CLOSE_WINDOW, (event) => {
    event.sender.close();
  });

  ipcMain.handle(IPC_CHANNEL.CREATE_PROJECT, (event, options: ICreateProjectOptions) => {
    return createProject(options, event);
  });
}
