import Store from 'electron-store';
import { STORE_KEY } from '../dicts/enums';

const initialStore = {
  [STORE_KEY.LANG]: 'zh-cn',
  [STORE_KEY.THEME]: 'auto'
};

export const GLStore = new Store();

Object.keys(initialStore).forEach((k) =>
  GLStore.set(k, initialStore[k as keyof typeof initialStore])
);
