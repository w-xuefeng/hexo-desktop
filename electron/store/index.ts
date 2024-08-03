import Store from 'electron-store';
import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';

export default function initIPCStoreEvent(store: Store) {
  ipcMain.on(IPC_CHANNEL.STORE_SAVE, (_event, { key, value }) => {
    store.set(key, value);
  });

  ipcMain.on(IPC_CHANNEL.STORE_GET, (event, key) => {
    const value = store.get(key);
    event.reply(`${IPC_CHANNEL.STORE_GET_REPLY}-${key}`, value);
  });

  ipcMain.on(IPC_CHANNEL.STORE_REMOVE, (_event, key) => {
    store.delete(key);
  });
}
