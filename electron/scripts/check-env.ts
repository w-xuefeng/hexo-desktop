import { logScript } from './script-logger';
import { execute, getExecutablePath, run, type ExecuteParams } from './shared';

const scriptName = 'check-env';
const cwd = process.cwd();
const env = process.env;
const shell = process.platform === 'win32' ? 'powershell' : void 0;

async function checkEnv() {
  const nodePath = getExecutablePath(scriptName, 'node') || 'node';
  const npmPath = getExecutablePath(scriptName, 'npm') || 'npm';
  const hexoPath = getExecutablePath(scriptName, 'hexo') || 'hexo';
  const candidateCommands: ExecuteParams[] = [
    {
      type: 'git',
      command: ['git', ['-v']],
      options: {
        cwd,
        env,
        shell
      }
    },
    {
      type: 'node',
      command: [nodePath, ['-v']],
      options: {
        cwd,
        env,
        shell
      }
    },
    {
      type: 'npm',
      command: [npmPath, ['-v']],
      options: {
        cwd,
        env,
        shell
      }
    },
    {
      type: 'hexo',
      command: [hexoPath, ['-v']],
      options: {
        cwd,
        env,
        shell
      }
    }
  ];
  const rs = await Promise.all(candidateCommands.map((command) => execute(command)));
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
}

run(scriptName, checkEnv);
