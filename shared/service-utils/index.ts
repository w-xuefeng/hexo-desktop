import path from 'node:path';
import net from 'node:net';
import logger from './logger';
import { app, shell } from 'electron';
import { runScriptBySubProcess } from './utility-process';
import fs, {
  appendFileSync,
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
import { execSync, exec } from 'node:child_process';
import { envExecutePath } from '../configs/main';
import { getPathShell } from './shell';
import { i18n, type Langs, type ExtraMessage } from '../utils/i18n';
import type { ExecuteResult, IExecutedMessage } from '../utils/types';

export function checkEnv(envPath?: string) {
  const ENV_PATH = envPath || (GLStore.get(STORE_KEY.ENV_PATH) as string);

  if (ENV_PATH && !process.env.PATH?.includes(ENV_PATH)) {
    process.env.PATH = [ENV_PATH, process.env.PATH].join(process.env.PATH_ENV_DELIMITER);
  }

  if (!ENV_PATH) {
    getEnvPath();
  }

  return new Promise<ExecuteResult[]>((resolve) => {
    const scriptName = 'check-env';
    const { child, kill } = runScriptBySubProcess(scriptName, {
      options: {
        env: {
          ...process.env
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
  const content = globSync(`${checkPath}/*`, {
    windowsPathsNoEscape: process.platform === 'win32'
  });
  return content.length === 0;
}

export function getDirectoryTree(checkPath: string) {
  const tree = globSync(`${checkPath}/**/*`, {
    windowsPathsNoEscape: process.platform === 'win32'
  });
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

export function readEnvPath() {
  const checkInfo = checkPath(envExecutePath);
  if (checkInfo.exist && checkInfo.isFile) {
    const envPath = readFileSync(envExecutePath, { encoding: 'utf-8' });
    if (!envPath) {
      return {
        success: false,
        path: process.env.PATH,
        sep: process.env.PATH_ENV_DELIMITER
      };
    }
    GLStore.set(STORE_KEY.ENV_PATH, envPath);
    if (!process.env.PATH?.includes(envPath)) {
      process.env.PATH = `${envPath}${process.env.PATH_ENV_DELIMITER}${process.env.PATH}`;
    }
    return {
      success: true,
      path: process.env.PATH,
      sep: process.env.PATH_ENV_DELIMITER
    };
  }
  return {
    success: false,
    path: process.env.PATH,
    sep: process.env.PATH_ENV_DELIMITER
  };
}

export function getEnvPath() {
  const readResult = readEnvPath();
  if (readResult.success) {
    return readResult;
  }
  const shellTarget = path.resolve(app.getPath('home'), PKG_CONFIG.name, 'shell');
  const scriptName = `get-path.${process.platform === 'win32' ? 'ps1' : 'sh'}`;
  const shellScript = path.resolve(shellTarget, scriptName);
  if (!existsSync(shellTarget)) {
    mkdirSync(shellTarget, { recursive: true });
    writeFileSync(shellScript, getPathShell(), { encoding: 'utf-8' });
  }
  if (process.platform !== 'win32') {
    chmodSync(shellScript, 0o666);
  }
  const commandMap: Record<NodeJS.Platform, string> = {
    win32: `powershell.exe -NoProfile -Command "& {Start-Process powershell.exe -ArgumentList '-NoProfile -File "${shellScript}"' -NoNewWindow -Wait; exit}"`,
    darwin: `osascript -e 'tell application "Terminal" to do script "sh ${shellScript}"'`,
    // ignore other platforms
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
  return readEnvPath();
}

export function directoryIsHexoProject(checkPath: string) {
  const content = globSync(`${checkPath}/*`, {
    windowsPathsNoEscape: process.platform === 'win32'
  });
  return ['package.json', '_config.yml', 'source', 'scaffolds'].every((item) =>
    content.some((e) => e.endsWith(item))
  );
}

export function hasInstalledDependencies(cwd: string) {
  const lockFile = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'pnpm-lock.yml',
    'bun.lockb'
  ];
  const nodeModules = path.join(cwd, 'node_modules');
  const depsDirectoryInfo = checkPath(nodeModules);
  if (
    depsDirectoryInfo.exist &&
    depsDirectoryInfo.isDirectory &&
    lockFile.some((e) => existsSync(path.join(cwd, e)))
  ) {
    logger(`[check dependencies]: the dependencies of ${cwd} has been installed`);
    return true;
  }

  return false;
}

export function tryInstallProjectDependencies(
  cwd: string,
  onStart?: () => void,
  onEnd?: (result?: string) => void
) {
  if (hasInstalledDependencies(cwd)) {
    return;
  }
  typeof onStart === 'function' && onStart();
  return new Promise<string>((resolve, reject) => {
    let rs = '';
    const child = exec('npm install', { cwd, env: process.env });
    child.stdout?.on('data', (data) => {
      rs += data?.toString() || '';
    });
    child.on('close', (code) => {
      logger(`[tryInstallProjectDependencies close]: ${code}`);
      typeof onEnd === 'function' && onEnd(rs);
      resolve(rs);
    });
    child.on('error', (err) => {
      typeof onEnd === 'function' && onEnd(rs);
      logger(`[tryInstallProjectDependencies error]: ${err}`);
      reject(err);
    });
  });
}

export function useI18n<EM>(extraMsg?: ExtraMessage<EM>) {
  const lang = GLStore.get(STORE_KEY.LANG) as Langs;
  return i18n(lang, extraMsg);
}

export function getAvailablePort(startPort = 4000) {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.once('close', () => {
        resolve(startPort);
      });
      server.close();
    });
    server.on('error', () => {
      getAvailablePort(startPort + 1)
        .then(resolve)
        .catch(reject);
    });
  });
}

export function writeForProject(cwd: string, filename: string, content: string, replace = false) {
  const target = path.join(cwd, filename);
  if (existsSync(target) && !replace) {
    appendFileSync(target, content, { encoding: 'utf-8' });
  } else {
    writeFileSync(target, content, { encoding: 'utf-8' });
  }
}

export function setNpmmirror(cwd: string, replace = false) {
  writeForProject(cwd, '.npmrc', 'registry=https://registry.npmmirror.com/', replace);
}

export function saveContentToFile(filePath: string, content: string) {
  try {
    writeFileSync(filePath, content, { encoding: 'utf-8' });
  } catch (error) {
    logger(`[saveContentToFile error]: ${error}`);
    return error instanceof Error ? error.toString() : void 0;
  }
}
