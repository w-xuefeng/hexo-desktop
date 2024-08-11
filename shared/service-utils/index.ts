import { spawn } from 'child_process';
import type { ExecuteResult } from '../utils/type';
import { app } from 'electron';

export function execute(
  ...args: [string, string[]]
) {
  return new Promise<ExecuteResult>((resolve) => {
    const child = spawn(...args);
    const result: ExecuteResult = {
      type: args[0],
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
    child.on('close', (code) => {
      result.code = code;
      resolve(result);
    });
  });
}

export async function checkEnv() {
  const appVersion = app.getVersion();
  const commands: [string, string[]][] = [
    ['git', ['-v']],
    ['node', ['-v']],
    ['npm', ['-v']],
    ['hexo', ['-v']]
  ];
  const rs = await Promise.all(
    commands.map((command) => execute(...command))
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
