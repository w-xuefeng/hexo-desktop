import path from 'node:path';
import { spawn, execSync, type SpawnOptionsWithoutStdio } from 'node:child_process';
import { logScript } from './script-logger';

export type ExecuteParams = {
  type: string;
  command: [string, string[]];
  options?: SpawnOptionsWithoutStdio;
  onData?(data: string): void;
  onError?(error: string): void;
  onStdError?(error: string): void;
};

export type ExecuteResult = {
  type: string;
  output: string | null;
  error: string | null;
  code: number | null;
  stderr: string | null;
};

export function execute(options: ExecuteParams) {
  return new Promise<ExecuteResult>((resolve) => {
    const child = spawn(...options.command, options.options);
    const result: ExecuteResult = {
      type: options.type,
      output: null,
      error: null,
      code: null,
      stderr: null
    };
    child.stdout?.on('data', (data) => {
      if (result.output) {
        result.output += data.toString();
      } else {
        result.output = data.toString();
      }
      if (typeof options.onData === 'function') {
        options.onData(data.toString());
      }
    });
    child.stderr?.on('data', (data) => {
      if (result.stderr) {
        result.stderr += data.toString();
      } else {
        result.stderr = data.toString();
      }
      if (typeof options.onStdError === 'function') {
        options.onStdError(data.toString());
      }
    });
    child.on('error', (err) => {
      if (result.error) {
        result.error += err.toString();
      } else {
        result.error = err.toString();
      }
      if (typeof options.onError === 'function') {
        options.onError(err.toString());
      }
    });
    child.on('close', (code) => {
      result.code = code;
      resolve(result);
    });
  });
}

export function getExecutablePath(scriptName: string, command: string): string | null {
  try {
    const platform = process.platform;
    const cmd = platform === 'win32' ? `where ${command}` : `which ${command}`;
    const output = execSync(cmd).toString().trim();
    const paths = output.split(/\r?\n/);
    let rs = paths.length > 0 ? path.resolve(paths[0]) : null;

    if (rs?.includes(' ')) {
      rs = `"${rs}"`;
    }

    logScript(scriptName, `[GetExecutablePath find ${command} path]: ${rs}`);
    return rs;
  } catch (error) {
    logScript(scriptName, `[GetExecutablePath Failed to find ${command}]: ${error}`);
    return null;
  }
}

export function run(trigger: string, callback: () => void) {
  process.parentPort.on('message', (e: { data: string }) => {
    if (e.data === trigger) {
      typeof callback === 'function' && callback();
    }
  });
}

export function runWaitExit(
  trigger: string,
  callback: () => void,
  exitTrigger: string,
  exitCallback?: () => void
) {
  process.parentPort.on('message', (e: { data: string }) => {
    if (e.data === trigger) {
      logScript(trigger, `[child process trigger]: ${trigger}`);
      typeof callback === 'function' && callback();
    }
    if (e.data === exitTrigger) {
      logScript(exitTrigger, `[child process exit trigger]: ${exitTrigger} for ${trigger}`);
      typeof exitCallback === 'function' && exitCallback();
      process.exit(0);
    }
  });
}
