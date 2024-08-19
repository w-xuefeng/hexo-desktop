import { app } from 'electron';
import { runScriptBySubProcess } from './utility-process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { globSync } from 'glob';
import { GLStore } from '../global-manager/stores';
import { STORE_KEY } from '../dicts/enums';
import logger from './logger';
import path from 'node:path';
import type { ExecuteResult, IExecutedMessage } from '../utils/types';

export function checkEnv() {
  const NODE_PATH = GLStore.get(STORE_KEY.NODE_PATH) as string;
  const NPM_PATH = GLStore.get(STORE_KEY.NPM_PATH) as string;
  const HEXO_PATH = GLStore.get(STORE_KEY.HEXO_PATH) as string;
  return new Promise<ExecuteResult[]>((resolve) => {
    const scriptName = 'check-env';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        env: {
          ...process.env,
          ...(NODE_PATH ? { NODE_PATH } : {}),
          ...(NPM_PATH ? { NPM_PATH } : {}),
          ...(HEXO_PATH ? { HEXO_PATH } : {})
        },
        cwd: app.getPath('home')
      }
    });
    child.once('message', (result: ExecuteResult[]) => {
      const appVersion = app.getVersion();
      const withAppResult = [
        {
          type: 'hexo desktop',
          output: appVersion,
          error: null,
          stderr: null,
          code: 0
        },
        ...result.map((e) => {
          if (e.type === 'hexo') {
            e.output = e.output?.split('\n')?.at(0) || null;
          }
          return e;
        })
      ];
      resolve(withAppResult);
      kill();
    });
    child.postMessage(scriptName);
  });
}

export function checkPath(checkPath: string) {
  const result = {
    exist: true,
    isFile: false,
    isDirectory: false
  };
  if (!existsSync(checkPath)) {
    result.exist = false;
    return result;
  }
  const stat = statSync(checkPath);
  result.isFile = stat.isFile();
  result.isDirectory = stat.isDirectory();
  return result;
}

export function createDirectory(createPath: string) {
  return mkdirSync(createPath, { recursive: true });
}

export function directoryIsEmpty(checkPath: string) {
  const content = globSync(`${checkPath}/*`);
  return content.length === 0;
}

export function getDirectoryTree(checkPath: string) {
  const tree = globSync(`${checkPath}/**/*`);
  return tree;
}

export function getCommandVersion(commandPath: string) {
  return new Promise<ExecuteResult>((resolve) => {
    const scriptName = 'exe';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        cwd: app.getPath('home'),
        env: {
          ...process.env,
          COMMAND: `${commandPath} -v`
        }
      }
    });
    child.on(
      'message',
      (rs: IExecutedMessage<'data', string> | IExecutedMessage<'result', ExecuteResult>) => {
        if (rs.type === 'result') {
          resolve(rs.data);
          kill();
        }
      }
    );
    child.postMessage(scriptName);
  });
}

export async function checkCommandPath(commandPath: string, checkFileName?: string) {
  const commandPathInfo = checkPath(commandPath);
  const result = {
    ...commandPathInfo,
    status: false,
    version: null as string | null,
    error: null as Error | string | null,
    stderr: null as string | null
  };
  if (!commandPathInfo.exist || !commandPathInfo.isFile) {
    return result;
  }
  if (
    checkFileName &&
    !commandPath.split(path.sep).at(-1)?.toLocaleLowerCase()?.includes(checkFileName)
  ) {
    result.error = new Error(`The path does not contain '${checkFileName}'`);
    return result;
  }
  try {
    const rs = await getCommandVersion(commandPath);
    result.status = !rs.error && !!rs.output;
    result.version = rs.output;
    result.error = rs.error;
    result.stderr = rs.stderr;
    return result;
  } catch (error) {
    logger(`[getCommandVersion error]: command:${commandPath} ${error}`, { level: 'error' });
    result.error = error as Error;
    return result;
  }
}
