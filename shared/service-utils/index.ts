import logger from './logger';
import path from 'node:path';
import { app, shell } from 'electron';
import { getParentPath, runScriptBySubProcess } from './utility-process';
import fs, {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { globSync } from 'glob';
import { GLStore } from '../global-manager/stores';
import { STORE_KEY } from '../dicts/enums';
import { PKG_CONFIG } from '../configs/app';
import { execSync } from 'node:child_process';
import { envExecutePath } from '../configs/main';
import { getPathShell } from './shell';
import type { ExecuteResult, IExecutedMessage } from '../utils/types';

export function checkEnv() {
  const NODE_PATH = GLStore.get(STORE_KEY.NODE_PATH) as string;
  const NPM_PATH = GLStore.get(STORE_KEY.NPM_PATH) as string;
  const HEXO_PATH = GLStore.get(STORE_KEY.HEXO_PATH) as string;
  const pathSet = new Set();

  if (NODE_PATH) {
    pathSet.add(getParentPath(NODE_PATH));
  }
  if (NPM_PATH) {
    pathSet.add(getParentPath(NPM_PATH));
  }
  if (HEXO_PATH) {
    pathSet.add(getParentPath(HEXO_PATH));
  }

  process.env.PATH = [...pathSet, process.env.PATH].join(process.env.PATH_ENV_DELIMITER);

  return new Promise<ExecuteResult[]>((resolve) => {
    const scriptName = 'check-env';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        env: {
          ...process.env,
          ...(NODE_PATH ? { NODE_PATH } : {}),
          ...(NPM_PATH ? { NPM_PATH } : {}),
          ...(HEXO_PATH ? { HEXO_PATH } : {})
        },
        cwd: app.getPath('home')
      }
    });
    child.once('message', (result: ExecuteResult[]) => {
      const appVersion = app.getVersion();
      const withAppResult = [
        {
          type: 'hexo desktop',
          output: appVersion,
          error: null,
          stderr: null,
          code: 0
        },
        ...result.map((e) => {
          if (e.type === 'hexo') {
            e.output = e.output?.split('\n')?.at(0) || null;
          }
          return e;
        })
      ];
      resolve(withAppResult);
      kill();
    });
    child.postMessage(scriptName);
  });
}

export function checkPath(checkPath: string) {
  const result = {
    exist: true,
    isFile: false,
    isDirectory: false
  };
  if (!existsSync(checkPath)) {
    result.exist = false;
    return result;
  }
  const stat = statSync(checkPath);
  result.isFile = stat.isFile();
  result.isDirectory = stat.isDirectory();
  return result;
}

export function createDirectory(createPath: string) {
  return mkdirSync(createPath, { recursive: true });
}

export function directoryIsEmpty(checkPath: string) {
  const content = globSync(`${checkPath}/*`);
  return content.length === 0;
}

export function getDirectoryTree(checkPath: string) {
  const tree = globSync(`${checkPath}/**/*`);
  return tree;
}

export function getCommandVersion(commandPath: string) {
  return new Promise<ExecuteResult>((resolve) => {
    const scriptName = 'exe';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        cwd: app.getPath('home'),
        env: {
          ...process.env,
          COMMAND: `${commandPath} -v`
        }
      }
    });
    child.on(
      'message',
      (rs: IExecutedMessage<'data', string> | IExecutedMessage<'result', ExecuteResult>) => {
        if (rs.type === 'result') {
          resolve(rs.data);
          kill();
        }
      }
    );
    child.postMessage(scriptName);
  });
}

export async function checkCommandPath(commandPath: string, checkFileName?: string) {
  const commandPathInfo = checkPath(commandPath);
  const result = {
    ...commandPathInfo,
    status: false,
    version: null as string | null,
    error: null as Error | string | null,
    stderr: null as string | null
  };
  if (!commandPathInfo.exist || !commandPathInfo.isFile) {
    return result;
  }
  if (
    checkFileName &&
    !commandPath.split(path.sep).at(-1)?.toLocaleLowerCase()?.includes(checkFileName)
  ) {
    result.error = new Error(`The path does not contain '${checkFileName}'`);
    return result;
  }
  try {
    const rs = await getCommandVersion(commandPath);
    result.status = !rs.error && !!rs.output;
    result.version = rs.output;
    result.error = rs.error;
    result.stderr = rs.stderr;
    return result;
  } catch (error) {
    logger(`[getCommandVersion error]: command:${commandPath} ${error}`, { level: 'error' });
    result.error = error as Error;
    return result;
  }
}

export function openExternal(url: string, options?: Electron.OpenExternalOptions) {
  return shell.openExternal(url, options);
}

export function copyResource(from: string, to: string) {
  const sourceFile = readdirSync(from, { withFileTypes: true });
  for (const file of sourceFile) {
    const srcFile = path.resolve(from, file.name);
    const tagFile = path.resolve(to, file.name);
    if (file.isDirectory() && !existsSync(tagFile)) {
      mkdirSync(tagFile);
      copyResource(srcFile, tagFile);
    } else if (file.isDirectory() && existsSync(tagFile)) {
      copyResource(srcFile, tagFile);
    }
    !file.isDirectory() && copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE);
  }
}

export function getEnvPath() {
  const checkInfo = checkPath(envExecutePath);
  if (checkInfo.exist && checkInfo.isFile) {
    const envPath = readFileSync(envExecutePath, { encoding: 'utf-8' });
    process.env.PATH = `${envPath}${process.env.PATH_ENV_DELIMITER}${process.env.PATH}`;
    return process.env.PATH;
  }

  const shellTarget = path.resolve(app.getPath('home'), PKG_CONFIG.name, 'shell');
  const scriptName = `get-path.${process.platform === 'win32' ? 'bat' : 'sh'}`;
  const shellScript = path.resolve(shellTarget, scriptName);
  if (!existsSync(shellTarget)) {
    mkdirSync(shellTarget, { recursive: true });
    writeFileSync(shellScript, getPathShell());
  }

  if (process.platform !== 'win32') {
    chmodSync(shellScript, 0o666);
  }

  const commandMap: Record<NodeJS.Platform, string> = {
    win32: `start cmd /c "${shellScript}"`,
    darwin: `osascript -e 'tell application "Terminal" to do script "sh ${shellScript};exit"'`,
    // other platform ignore
    linux: `gnome-terminal -- bash -c "sh ${shellScript}; exit"`,
    aix: `xterm -hold -e "sh ${shellScript}; exit"`,
    android: `xterm -hold -e "sh ${shellScript}; exit"`,
    freebsd: `xterm -hold -e "sh ${shellScript}; exit"`,
    haiku: `xterm -hold -e "sh ${shellScript}; exit"`,
    openbsd: `xterm -hold -e "sh ${shellScript}; exit"`,
    sunos: `xterm -hold -e "sh ${shellScript}; exit"`,
    cygwin: `xterm -hold -e "sh ${shellScript}; exit"`,
    netbsd: `xterm -hold -e "sh ${shellScript}; exit"`
  };

  execSync(commandMap[process.platform]);

  const checkAgainInfo = checkPath(envExecutePath);
  if (checkAgainInfo.exist && checkAgainInfo.isFile) {
    const envPath = readFileSync(envExecutePath, { encoding: 'utf-8' });
    process.env.PATH = `${envPath}${process.env.PATH_ENV_DELIMITER}${process.env.PATH}`;
    return process.env.PATH;
  }
}
