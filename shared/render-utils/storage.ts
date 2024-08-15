import { IPC_CHANNEL } from '../dicts/enums';

export class SharedStorage {
  /**
   * localStorage
   */
  public static getStorage<T = Record<string, any>>(key: string, storage: Storage = localStorage) {
    const ls = storage;
    if (!ls) {
      return undefined;
    }

    let v = ls.getItem(key);
    if (!v) {
      return undefined;
    }

    if (v.indexOf('obj-') === 0) {
      v = v.slice(4);
      return JSON.parse(v) as T;
    }

    if (v.indexOf('str-') === 0) {
      return v.slice(4);
    }

    return undefined;
  }

  public static setStorage(key: string, value: any, storage: Storage = localStorage) {
    if ([2, 3].includes(arguments.length)) {
      let v = value;
      if (typeof v === 'object') {
        v = JSON.stringify(v);
        v = 'obj-' + v;
      } else {
        v = 'str-' + v;
      }
      const ls = storage;
      if (ls) {
        ls.setItem(key, v);
      }
    }
  }

  public static removeStorage(key: string, storage: Storage = localStorage) {
    const ls = storage;
    if (ls && key) {
      ls.removeItem(key);
    }
  }

  public static clearStorage(storage: Storage = localStorage) {
    const ls = storage;
    if (ls) {
      ls.clear();
    }
  }

  /**
   * sessionStorage
   */
  public static getSession<T = Record<string, any>>(key: string) {
    return this.getStorage<T>(key, sessionStorage);
  }

  public static setSession(key: string, value: any) {
    this.setStorage(key, value, sessionStorage);
  }

  public static removeSession(key: string) {
    this.removeStorage(key, sessionStorage);
  }

  public static clearSession() {
    this.clearStorage(sessionStorage);
  }
}

export class SharedStore {
  public static get(key: string) {
    return window.ipcRenderer.invoke(IPC_CHANNEL.STORE_GET, key);
  }

  public static getSync(key: string) {
    return window.ipcRenderer.sendSync(IPC_CHANNEL.STORE_GET_SYNC, key);
  }

  public static set<T>(key: string, value: T) {
    window.ipcRenderer.invoke(IPC_CHANNEL.STORE_SAVE, {
      key,
      value
    });
  }

  public static remove(key: string) {
    window.ipcRenderer.invoke(IPC_CHANNEL.STORE_REMOVE, key);
  }
}
