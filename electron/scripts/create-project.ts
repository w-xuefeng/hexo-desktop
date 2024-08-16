import { logScript } from './script-logger';
import { execute, run } from './shared';

const scriptName = 'create-project';
const HEXO_PATH = process.env.HEXO_PATH!;
const PROJECT_NAME = process.env.PROJECT_NAME!;

async function createProject() {
  const rs = await execute({
    type: 'hexo-cli',
    command: [HEXO_PATH, ['init', PROJECT_NAME]],
    options: {
      cwd: process.cwd()
    },
    onData: (data) => {
      process.parentPort.postMessage({
        type: 'data',
        data
      });
    }
  });
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage({
    type: 'result',
    data: rs
  });
  process.exit(0);
}

run(scriptName, createProject);
