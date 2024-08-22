import { logScript } from './script-logger';
import { execute, getExecutablePath, run, type ExecuteParams } from './shared';

const scriptName = 'check-env';
const cwd = process.cwd();

async function checkEnv() {
  const nodePath = getExecutablePath(scriptName, 'node') || 'node';
  const npmPath = getExecutablePath(scriptName, 'npm') || 'npm';
  const hexoPath = getExecutablePath(scriptName, 'hexo') || 'hexo';
  const candidateCommands: ExecuteParams[] = [
    {
      type: 'git',
      command: ['git', ['-v']],
      options: {
        cwd
      }
    },
    {
      type: 'node',
      command: [nodePath, ['-v']],
      options: {
        cwd
      }
    },
    {
      type: 'npm',
      command: [npmPath, ['-v']],
      options: {
        cwd
      }
    },
    {
      type: 'hexo',
      command: [hexoPath, ['-v']],
      options: {
        cwd
      }
    }
  ];
  const rs = await Promise.all(candidateCommands.map((command) => execute(command)));
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
}

run(scriptName, checkEnv);
