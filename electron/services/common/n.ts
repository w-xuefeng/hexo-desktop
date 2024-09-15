import { IPC_CHANNEL, LOADING_CATEGORY } from '../../../shared/dicts/enums';
import { GLWins } from '../../../shared/global-manager/wins';

export function notifyGlobalLoading(
  winId: string,
  type: 'open' | 'close',
  text?: string,
  category?: LOADING_CATEGORY
) {
  const mainWin = GLWins.getMainWin(winId);
  mainWin?.win?.webContents.send(IPC_CHANNEL.GL_LOADING, {
    type,
    text,
    category
  });
}

export function startGlobalLoading(winId: string, text?: string, category?: LOADING_CATEGORY) {
  notifyGlobalLoading(winId, 'open', text, category);
}

export function closeGlobalLoading(winId: string) {
  notifyGlobalLoading(winId, 'close');
}
