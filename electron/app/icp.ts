import Store from 'electron-store';
import path from 'node:path';
import initIPCStoreEvent from '../store';
import importProject from '../services/project/import-project';
import { dialog, ipcMain, type OpenDialogOptions } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv, checkCommandPath } from '../../shared/service-utils';
import { createProject } from '../services/project/create-project';
import { createIndependentWindow } from '../window/independent-win';
import { GLIPCEventHandled } from '../../shared/global-manager/vars';
import { type ICreateProjectOptions } from '../../shared/utils/types';

export default function initIPCEvent(store: Store) {
  if (GLIPCEventHandled.current) {
    return;
  }

  initIPCStoreEvent(store);

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, () => {
    return checkEnv();
  });

  ipcMain.handle(
    IPC_CHANNEL.CHECK_COMMAND_PATH,
    (_, commandPath: string, checkFileName?: string) => {
      return checkCommandPath(commandPath, checkFileName);
    }
  );

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

  ipcMain.handle(IPC_CHANNEL.IMPORT_PROJECT, (_, options: Partial<OpenDialogOptions>) => {
    return importProject(options);
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

  ipcMain.handle(IPC_CHANNEL.CREATE_PROJECT, (event, options: ICreateProjectOptions) => {
    return createProject(options, event);
  });

  GLIPCEventHandled.current = true;
}
