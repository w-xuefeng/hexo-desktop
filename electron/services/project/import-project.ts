import R from '../common/r';
import { dialog, type OpenDialogOptions } from 'electron';
import { GLWins } from '../../../shared/global-manager/wins';
import { IPC_CHANNEL } from '../../../shared/dicts/enums';
import logger from '../../../shared/service-utils/logger';

export default async function importProject(options: Partial<OpenDialogOptions>) {
  try {
    const target = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory']
    });
    if (target.canceled) {
      return R.fail('canceled');
    }
    const [projectPath] = target.filePaths;
    if (!projectPath) {
      return R.fail('without projectPath');
    }
    // TODO
    GLWins.mainWin?.webContents.send(IPC_CHANNEL.CHANGE_ROUTER, 'replace', {
      name: 'main-editor',
      query: {
        path: projectPath
      }
    });
    GLWins.mainWin?.maximize();
    return R.success(projectPath);
  } catch (error) {
    logger(`[ImportProject Error]: ${error}`);
    return R.fail();
  }
}
