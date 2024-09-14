import { IPC_CHANNEL } from '../../../shared/dicts/enums';
import { GLWins } from '../../../shared/global-manager/wins';

export function notifyGlobalLoading(winId: string, type: 'open' | 'close', text?: string) {
  const mainWin = GLWins.getMainWin(winId);
  mainWin?.win?.webContents.send(IPC_CHANNEL.GL_LOADING, {
    type,
    text
  });
}

export function startGlobalLoading(winId: string, text?: string) {
  notifyGlobalLoading(winId, 'open', text);
}

export function closeGlobalLoading(winId: string) {
  notifyGlobalLoading(winId, 'close');
}
