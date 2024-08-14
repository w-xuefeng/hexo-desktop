import Store from 'electron-store';
import initIPCStoreEvent from '../store';
import { dialog, ipcMain, type OpenDialogOptions } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv } from '../../shared/service-utils';
import importProject from '../services/project/import-project';
import createProject from '../services/project/create-project';
import { type ICreateProjectOptions } from '../../shared/utils/types';

export default function initIPCEvent(store: Store) {
  initIPCStoreEvent(store);

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, () => {
    return checkEnv();
  });

  ipcMain.handle(IPC_CHANNEL.CHOOSE_DIRECTORY, (_, options: Partial<OpenDialogOptions>) => {
    return dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory']
    });
  });

  ipcMain.handle(IPC_CHANNEL.IMPORT_PROJECT, (_, options: Partial<OpenDialogOptions>) => {
    return importProject(options);
  });

  ipcMain.handle(IPC_CHANNEL.CREATE_PROJECT, (_, options: ICreateProjectOptions) => {
    return createProject(options);
  });
}
