import { STORAGE_KEY } from '../dicts/enums';
import { SharedStorage } from './storage';

export function setCurrentWinId(winId: string) {
  SharedStorage.setSession(STORAGE_KEY.WIN_ID, winId);
}
export function getCurrentWinId() {
  return SharedStorage.getSession(STORAGE_KEY.WIN_ID) as string;
}
