import logger from './logger';
import { app } from 'electron';
import { spawn } from 'child_process';

import type { ExecuteResult, ExecuteParams } from '../utils/type';

export function execute(options: ExecuteParams) {
  return new Promise<ExecuteResult>((resolve) => {
    const child = spawn(...options.command);
    const result: ExecuteResult = {
      type: options.type,
      output: null,
      error: null,
      code: null
    };
    child.stdout?.on('data', (data) => {
      if (result.output) {
        result.output += data.toString();
      } else {
        result.output = data.toString();
      }
    });
    child.stderr?.on('data', (data) => {
      if (result.error) {
        result.error += data.toString();
      } else {
        result.error = data.toString();
      }
    });
    child.on('error', (err) => {
      if (result.error) {
        result.error += err.toString();
      } else {
        result.error = err.toString();
      }
    });
    child.on('close', (code) => {
      result.code = code;
      resolve(result);
    });
  });
}

export async function checkEnv() {
  const appVersion = app.getVersion();
  const candidateCommands: ExecuteParams[] = [
    {
      type: 'git',
      command: ['git', ['-v']]
    },
    {
      type: 'node',
      command: ['node', ['-v']]
    },
    {
      type: 'npm',
      command: ['npm', ['-v']]
    }
  ];
  const rs = await Promise.all(candidateCommands.map((command) => execute(command)));
  const withAppResult = [
    {
      type: 'hexo desktop',
      output: appVersion,
      error: null,
      code: 0
    },
    ...rs
  ];
  logger(`[checkEnv result]: ${JSON.stringify(withAppResult)}`);
  return withAppResult;
}
