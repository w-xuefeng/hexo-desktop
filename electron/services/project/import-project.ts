import R from '../common/r';
import { app, dialog, type OpenDialogOptions } from 'electron';
import { GLWins } from '../../../shared/global-manager/wins';
import { IPC_CHANNEL } from '../../../shared/dicts/enums';
import { checkPath, directoryIsHexoProject } from '../../../shared/service-utils';
import logger from '../../../shared/service-utils/logger';

export async function importProjectByDrop(winId: string, projectPath?: string) {
  try {
    if (!projectPath) {
      return R.fail('exception.withoutProjectPath');
    }
    const projectPathState = checkPath(projectPath);
    if (!projectPathState.exist || !projectPathState.isDirectory) {
      return R.fail('exception.directoryNotExist');
    }

    if (!directoryIsHexoProject(projectPath)) {
      return R.fail('exception.directoryIsNotHexoProject');
    }

    const mainWin = GLWins.getMainWin(winId);

    mainWin?.win?.webContents.send(IPC_CHANNEL.CHANGE_ROUTER, 'replace', {
      name: 'main-editor',
      query: {
        path: projectPath
      }
    });
    mainWin?.win?.maximize();
    app.addRecentDocument(projectPath);
    return R.success(projectPath);
  } catch (error) {
    logger(`[ImportProject Error]: ${error}`);
    return R.fail();
  }
}

export async function importProject(winId: string, options: Partial<OpenDialogOptions>) {
  try {
    const target = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory']
    });
    if (target.canceled) {
      return R.fail('exception.canceled');
    }
    const [projectPath] = target.filePaths;
    if (!projectPath) {
      return R.fail('exception.withoutProjectPath');
    }
    const projectPathState = checkPath(projectPath);
    if (!projectPathState.exist || !projectPathState.isDirectory) {
      return R.fail('exception.directoryNotExist');
    }

    if (!directoryIsHexoProject(projectPath)) {
      return R.fail('exception.directoryIsNotHexoProject');
    }

    const mainWin = GLWins.getMainWin(winId);

    mainWin?.win?.webContents.send(IPC_CHANNEL.CHANGE_ROUTER, 'replace', {
      name: 'main-editor',
      query: {
        path: projectPath
      }
    });
    mainWin?.win?.maximize();
    app.addRecentDocument(projectPath);
    return R.success(projectPath);
  } catch (error) {
    logger(`[ImportProject Error]: ${error}`);
    return R.fail();
  }
}
