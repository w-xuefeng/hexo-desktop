import { createIndependentWindow } from '../../window/independent-win';
import { GLWins } from '../../../shared/global-manager/wins';
import { IPC_CHANNEL } from '../../../shared/dicts/enums';
import { checkPath, createDirectory, directoryIsEmpty } from '../../../shared/service-utils';
import R from '../common/r';
import { type ICreateProjectOptions } from '../../../shared/utils/types';
import path from 'node:path';

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
  const projectLocationPathInfo = checkPath(options.path);
  if (!projectLocationPathInfo?.exist) {
    createDirectory(options.path);
  }
  const projectPath = path.join(options.path, options.name);
  const projectPathInfo = checkPath(projectPath);
  if (projectPathInfo?.exist && !directoryIsEmpty(projectPath)) {
    return R.fail('exception.projectPathIsNotEmpty');
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
