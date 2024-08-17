import { app } from 'electron';
import { getExecutablePath, runScriptBySubProcess } from './utility-process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { globSync } from 'glob';
import { GLStore } from '../global-manager/stores';
import { STORE_KEY } from '../dicts/enums';
import logger from './logger';
import path from 'node:path';
import type { ExecuteResult } from '../utils/types';

export function checkEnv() {
  const NODE_PATH = GLStore.get(STORE_KEY.NODE_PATH) as string;
  const NPM_PATH = GLStore.get(STORE_KEY.NPM_PATH) || getExecutablePath('npm', NODE_PATH);
  if (NPM_PATH) {
    GLStore.set(STORE_KEY.NPM_PATH, NPM_PATH);
  }
  return new Promise<ExecuteResult[]>((resolve) => {
    const scriptName = 'check-env';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        env: {
          ...process.env,
          NODE_PATH,
          NPM_PATH
        },
        cwd: app.getPath('home')
      }
    });
    child.once('message', (result) => {
      const appVersion = app.getVersion();
      const withAppResult = [
        {
          type: 'hexo desktop',
          output: appVersion,
          error: null,
          code: 0
        },
        ...result
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

export function getNodeVersion(nodePath: string) {
  return new Promise<ExecuteResult>((resolve) => {
    const scriptName = 'check-node-path';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        cwd: app.getPath('home'),
        env: {
          ...process.env,
          NODE_PATH: nodePath
        }
      }
    });
    child.once('message', (rs: ExecuteResult) => {
      resolve(rs);
      kill();
    });
    child.postMessage(scriptName);
  });
}

export async function checkNodePath(nodePath: string) {
  const nodePathInfo = checkPath(nodePath);
  const result = {
    ...nodePathInfo,
    status: false,
    version: null as string | null,
    error: null as Error | null
  };
  if (!nodePathInfo.exist || !nodePathInfo.isFile) {
    return result;
  }
  if (!nodePath.split(path.sep).at(-1)?.toLocaleLowerCase()?.includes('node')) {
    result.error = new Error(`The path does not contain 'node'`);
    return result;
  }
  try {
    const rs = await getNodeVersion(nodePath);
    result.status = !rs.error;
    result.version = rs.output;
    return result;
  } catch (error) {
    logger(`[getNodeVersion error]: ${error}`, { level: 'error' });
    result.error = error as Error;
    return result;
  }
}
