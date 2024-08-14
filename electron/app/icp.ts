import Store from 'electron-store';
import { dialog, ipcMain, type OpenDialogOptions } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv } from '../../shared/service-utils';
import initIPCStoreEvent from '../store';

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
}
