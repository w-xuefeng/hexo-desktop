import { app } from 'electron';
import { runScriptBySubProcess } from './utility-process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { globSync } from 'glob';
import type { ExecuteResult } from '../utils/types';

export function checkEnv() {
  return new Promise<ExecuteResult[]>((resolve) => {
    const { child, kill } = runScriptBySubProcess('check-env');
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
    child.postMessage('check-env');
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
