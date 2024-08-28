import { logScript } from './script-logger';
import { execute, run } from './shared';

const scriptName = 'exe';
const COMMAND = process.env.COMMAND!;
const [command, ...args] = COMMAND.split(' ');
const shell = void 0;

run(scriptName, async () => {
  const rs = await execute({
    type: command,
    command: [command, args],
    options: {
      cwd: process.cwd(),
      env: process.env,
      shell
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
});
