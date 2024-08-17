import { logScript } from './script-logger';
import { execute, run } from './shared';

const scriptName = 'check-node-path';
const NODE_PATH = process.env.NODE_PATH!;

run(scriptName, async () => {
  const rs = await execute({
    type: 'node',
    command: [NODE_PATH, ['-v']],
    options: {
      cwd: process.cwd()
    }
  });
  logScript(scriptName, `[${scriptName} result]: ${JSON.stringify(rs)}`);
  process.parentPort.postMessage(rs);
  process.exit(0);
});
