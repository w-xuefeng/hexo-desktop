import { logScript } from './script-logger';
import { execute, getExecutablePath, run, type ExecuteParams } from './shared';

const scriptName = 'check-env';
const NODE_PATH = process.env.NODE_PATH!;
const NPM_PATH = process.env.NPM_PATH!;
const HEXO_PATH = process.env.HEXO_PATH!;
const cwd = process.cwd();

async function checkEnv() {
  const nodePath = NODE_PATH || getExecutablePath(scriptName, 'node') || 'node';
  const npmPath = NPM_PATH || getExecutablePath(scriptName, 'npm') || 'npm';
  const hexoPath = HEXO_PATH || getExecutablePath(scriptName, 'hexo') || 'hexo';
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
