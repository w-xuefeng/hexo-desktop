import Store from 'electron-store';
import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { checkEnv } from '../../shared/service-utils';

export default function initIPCStoreEvent(store: Store) {
  ipcMain.handle(IPC_CHANNEL.STORE_SAVE, (_event, { key, value }) => {
    store.set(key, value);
  });

  ipcMain.handle(IPC_CHANNEL.STORE_GET, (_event, key) => {
    const value = store.get(key);
    return value;
  });

  ipcMain.handle(IPC_CHANNEL.STORE_REMOVE, (_event, key) => {
    store.delete(key);
  });

  ipcMain.handle(IPC_CHANNEL.CHECK_ENV, () => {
    return checkEnv();
  });
}
