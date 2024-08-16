import { createIndependentWindow } from '../../window/independent-win';
import { GLWins } from '../../../shared/global-manager/wins';
import { IPC_CHANNEL } from '../../../shared/dicts/enums';
import { checkPath, createDirectory } from '../../../shared/service-utils';
import R from '../common/r';
import { type ICreateProjectOptions } from '../../../shared/utils/types';

export function openCreateProjectPanel(
  routePath: string,
  options?: Partial<Electron.BrowserWindowConstructorOptions>
) {
  return createIndependentWindow(routePath, options);
}

export async function createProject(
  options: ICreateProjectOptions,
  fromEvent?: Electron.IpcMainInvokeEvent
) {
  const projectPathInfo = checkPath(options.path);
  if (!projectPathInfo?.exist) {
    createDirectory(options.path);
  }
  // TOD
  fromEvent?.sender.close();
  GLWins.mainWin?.webContents.send(IPC_CHANNEL.CHANGE_ROUTER, 'replace', {
    name: 'main-editor',
    query: {
      path: options.path
    }
  });
  GLWins.mainWin?.maximize();
  return R.success(options.path);
}
