import { logScript } from './script-logger';
import { execute, getExecutablePath, run, type ExecuteParams } from './shared';

const scriptName = 'check-env';

async function checkEnv() {
  const nodePath = getExecutablePath(scriptName, 'node') || 'node';
  const npmPath = getExecutablePath(scriptName, 'npm') || 'npm';
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
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
}

run(scriptName, checkEnv);
