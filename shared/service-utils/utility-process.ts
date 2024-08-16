import path from 'node:path';
import logger from './logger';
import { utilityProcess } from 'electron';

export interface IRunScriptBySubProcessOptions {
  args?: string[];
  options?: Electron.ForkOptions;
}

export const childProcessMap = new Map<string, Electron.UtilityProcess>();

export const scriptPath = (p: string) => path.resolve(process.env.MAIN_DIST!, 'scripts', `${p}.js`);

export function runScriptBySubProcess(
  p: string,
  options?: IRunScriptBySubProcessOptions,
  alwaysCreateChildProcess = true
) {
  const filePath = scriptPath(p);
  let child = alwaysCreateChildProcess
    ? utilityProcess.fork(filePath, options?.args, options?.options)
    : childProcessMap.get(p);
  logger(`[RunScriptBySubProcess LOG]: script file path: ${filePath}`);
  if (!child) {
    child = utilityProcess.fork(filePath, options?.args, options?.options);
    childProcessMap.set(filePath, child);
  }
  function kill() {
    childProcessMap.delete(filePath);
    child?.kill?.();
    logger(`[RunScriptBySubProcess LOG]: kill utilityProcess, script file path: ${filePath}`);
  }
  return {
    child,
    kill
  };
}
