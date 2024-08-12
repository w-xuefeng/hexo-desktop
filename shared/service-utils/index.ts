import path from 'node:path';
import { app } from 'electron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';

import type {
  ExecuteResult,
  ExecuteParams
} from '../utils/type';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

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
  const nodePath = process.execPath;
  const yarnPath = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    'yarn'
  );
  const hexoPath = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    'hexo'
  );

  const candidateCommands: ExecuteParams[] = [
    {
      type: 'git',
      command: ['git', ['-v']]
    },
    {
      type: 'node',
      command: [nodePath, ['-v']]
    },
    {
      type: 'yarn',
      command: [yarnPath, ['-v']]
    },
    {
      type: 'hexo',
      command: [hexoPath, ['-v']]
    }
  ];
  const rs = await Promise.all(
    candidateCommands.map((command) =>
      execute(command)
    )
  );
  return [
    {
      type: 'hexo desktop',
      output: appVersion,
      error: null,
      code: 0
    },
    ...rs.map((e) => {
      if (e.type === 'hexo' && !e.error) {
        e.output =
          e.output?.split('\n').at(0) || null;
      }
      return e;
    })
  ];
}
