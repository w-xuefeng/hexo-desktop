import Store from 'electron-store';
import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { GLWins } from '../../shared/global-manager/wins';

export default function initIPCStoreEvent(store: Store) {
  ipcMain.handle(IPC_CHANNEL.STORE_SAVE, (_event, { key, value }) => {
    store.set(key, value);
  });

  ipcMain.handle(IPC_CHANNEL.STORE_GET, (_event, key) => {
    const value = store.get(key);
    return value;
  });

  ipcMain.on(IPC_CHANNEL.STORE_GET_SYNC, (event, key) => {
    const value = store.get(key);
    event.returnValue = value;
  });

  ipcMain.handle(IPC_CHANNEL.STORE_REMOVE, (_event, key) => {
    store.delete(key);
  });

  store.onDidAnyChange((newValue?: Readonly<any>, oldValue?: Readonly<any>) => {
    GLWins.sendToAllWindows(IPC_CHANNEL.STORE_CHANGED, newValue, oldValue);
  });
}
