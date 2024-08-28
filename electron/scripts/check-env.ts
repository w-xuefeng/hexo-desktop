import { logScript } from './script-logger';
import { execute, run, type ExecuteParams } from './shared';

const scriptName = 'check-env';
const cwd = process.cwd();

async function checkEnv() {
  const nodePath = 'node';
  const npmPath = 'npm';
  const hexoPath = 'hexo';
  const candidateCommands: ExecuteParams[] = [
    {
      type: 'git',
      command: ['git', ['-v']],
      options: {
        cwd,
        env: process.env
      }
    },
    {
      type: 'node',
      command: [nodePath, ['-v']],
      options: {
        cwd,
        env: process.env
      }
    },
    {
      type: 'npm',
      command: [npmPath, ['-v']],
      options: {
        cwd,
        env: process.env
      }
    },
    {
      type: 'hexo',
      command: [hexoPath, ['-v']],
      options: {
        cwd,
        env: process.env
      }
    }
  ];
  const rs = await Promise.all(candidateCommands.map((command) => execute(command)));
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
}

run(scriptName, checkEnv);
