import path from 'node:path';
import { GLWins } from '../../../shared/global-manager/wins';
import { GLStore } from '../../../shared/global-manager/stores';
import { IPC_CHANNEL, STORE_KEY } from '../../../shared/dicts/enums';
import { checkPath, createDirectory, directoryIsEmpty } from '../../../shared/service-utils';
import {
  getParentPath,
  runScriptBySubProcess
} from '../../../shared/service-utils/utility-process';
import R from '../common/r';
import type { ExecuteResult, ICreateProjectOptions } from '../../../shared/utils/types';

function initHexoProject(cwd: string, name: string, onData?: (data: string) => void) {
  const hexoPath = GLStore.get(STORE_KEY.HEXO_PATH) || 'hexo';
  const NODE_PATH = GLStore.get(STORE_KEY.NODE_PATH) as string;
  return new Promise<ExecuteResult>((resolve) => {
    const scriptName = 'exe';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        cwd,
        env: {
          ...process.env,
          COMMAND: `${hexoPath} init ${name}`,
          ...(NODE_PATH
            ? {
                NODE_PATH,
                PATH: `${getParentPath(NODE_PATH)}${process.env.PATH_ENV_DELIMITER}${process.env.PATH}`
              }
            : {})
        }
      }
    });
    child.on('message', ({ type, data }) => {
      if (type === 'data') {
        onData?.(data);
        return;
      }
      if (type === 'result') {
        kill();
        resolve(data);
      }
    });
    child.postMessage(scriptName);
  });
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
  const rs = await initHexoProject(options.path, options.name, (data) => {
    fromEvent?.sender.send(IPC_CHANNEL.CREATE_PROJECT_PROGRESS, data);
  });

  if (rs.error) {
    return R.fail(rs.error);
  }

  fromEvent?.sender.close();
  GLWins.mainWin?.webContents.send(IPC_CHANNEL.CHANGE_ROUTER, 'replace', {
    name: 'main-editor',
    query: {
      path: projectPath
    }
  });
  GLWins.mainWin?.maximize();
  return R.success(projectPath);
}
