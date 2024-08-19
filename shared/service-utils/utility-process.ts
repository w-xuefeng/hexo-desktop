import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import logger from './logger';
import { spawnSync, execSync, spawn } from 'node:child_process';
import { utilityProcess } from 'electron';
import { PKG_CONFIG } from '../configs/app';
import type { ExecuteParams, ExecuteResult } from '../utils/types';

export interface IRunScriptBySubProcessOptions {
  args?: string[];
  options?: Electron.ForkOptions;
}

export const childProcessMap = new Map<string, Electron.UtilityProcess>();

export function getParentPath(fullPath: string) {
  const temp = fullPath.split(path.sep);
  temp.pop();
  return temp.join(path.sep);
}

export function filePath(type: string, ...filePath: string[]) {
  return path.join(os.homedir(), PKG_CONFIG.name, type, ...filePath);
}

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
    });
    child.on('error', (err) => {
      if (result.error) {
        result.error += err.toString();
      } else {
        result.error = err.toString();
      }
    });
    child.on('close', (code) => {
      result.code = code;
      resolve(result);
    });
  });
}

export function getExecutablePath(command: string, nodePath?: string): string | null {
  try {
    if (nodePath) {
      const tempDir = filePath('.temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      const tempCommandFile = filePath('.temp', `get-${command}-path.js`);
      fs.writeFileSync(
        tempCommandFile,
        `const path = require('path');
const { execSync } = require('child_process');
const cmd = process.platform === 'win32' ? "where ${command}" : "which ${command}";
const output = execSync(cmd).toString().trim();
const paths = output.split(/\\r?\\n/);
const rs = paths.length > 0 ? path.resolve(paths[0]) : null;
console.log(rs);
process.exit(0);
`,
        { encoding: 'utf-8' }
      );
      const rs = spawnSync(nodePath, [tempCommandFile], {
        encoding: 'utf-8'
      })
        ?.stdout?.toString()
        ?.trim();
      fs.rmSync(tempCommandFile);
      logger(`[GetExecutablePath find ${command} path]: ${rs}`);
      return rs === 'null' ? null : rs;
    }
    const platform = process.platform;
    const cmd = platform === 'win32' ? `where ${command}` : `which ${command}`;
    const output = execSync(cmd).toString().trim();
    const paths = output.split(/\r?\n/);
    const rs = paths.length > 0 ? path.resolve(paths[0]) : null;
    logger(`[GetExecutablePath find ${command} path]: ${rs}`);
    return rs;
  } catch (error) {
    logger(`[GetExecutablePath Failed to find ${command}]: ${error}`);
    return null;
  }
}

export function exeWithOuterNode(
  nodePath: string,
  scriptName: string,
  scriptContent: string
): string | null {
  const tempDir = filePath('.temp-script');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const tempCommandFile = filePath('.temp-script', `${scriptName}.js`);
  fs.writeFileSync(tempCommandFile, scriptContent, { encoding: 'utf-8' });
  const rs = execSync(`${nodePath} ${tempCommandFile}`, {
    encoding: 'utf-8',
    env: {
      ...process.env
    }
  })
    ?.toString()
    ?.trim();
  fs.rmSync(tempCommandFile);
  logger(`[ExeWithOuterNode ${scriptName}]: ${rs}`);
  return rs;
}
