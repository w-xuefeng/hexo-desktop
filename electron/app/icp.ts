import Store from 'electron-store';
import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv } from '../../shared/service-utils';
import initIPCStoreEvent from '../store';

export default function initIPCEvent(store: Store) {
  initIPCStoreEvent(store);

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, () => {
    return checkEnv();
  });
}
