import path from 'node:path';
import { spawn, execSync } from 'child_process';
import { logScript } from './script-logger';
import type { ExecuteParams, ExecuteResult } from '../../shared/utils/types';

const scriptName = 'check-env';

function execute(options: ExecuteParams) {
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

function getExecutablePath(command: string): string | null {
  try {
    const platform = process.platform;
    const cmd = platform === 'win32' ? `where ${command}` : `which ${command}`;
    const output = execSync(cmd).toString().trim();
    const paths = output.split(/\r?\n/);
    const rs = paths.length > 0 ? path.resolve(paths[0]) : null;
    logScript(scriptName, `[GetExecutablePath find ${command} path]: ${rs}`);
    return rs;
  } catch (error) {
    logScript(scriptName, `[GetExecutablePath Failed to find ${command}]: ${error}`);
    return null;
  }
}

async function checkEnv() {
  const nodePath = getExecutablePath('node') || 'node';
  const npmPath = getExecutablePath('npm') || 'npm';
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
      type: 'npm',
      command: [npmPath, ['-v']]
    }
  ];
  const rs = await Promise.all(candidateCommands.map((command) => execute(command)));
  logScript(scriptName, `[checkEnv result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
}

process.parentPort.on('message', (e: { data: string }) => {
  if (e.data === 'check-env') {
    checkEnv();
  }
});
