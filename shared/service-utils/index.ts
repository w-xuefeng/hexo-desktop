import { app } from 'electron';
import { runScriptBySubProcess } from './utility-process';
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
