import { getAvailablePort } from '../../../../shared/service-utils';
import { sleep } from '../../../../shared/utils';
import { GLWins } from '../../../../shared/global-manager/wins';
import { exec } from 'child_process';

export async function serverHexo(winId: string) {
  const win = GLWins.getMainWin(winId);
  if (!win?.hexo.value || !win.hexo.path) {
    return;
  }
  if (win?.hexo?.serverProcess && win.hexo.serverProcessPort) {
    return win.hexo.serverProcessPort;
  }
  const port = await getAvailablePort();
  const args = ['-s', '-p', port];
  const child = exec(`npm run server ${args.join(' ')}`, {
    cwd: win.hexo.path,
    env: process.env
  });
  win.hexo.serverProcess = child;
  win.hexo.serverProcessPort = port;
  win.hexo.serverProcessPid = child.pid;
  await sleep();
  return port;
}

export async function exitHexoServer(winId: string) {
  const win = GLWins.getMainWin(winId);
  if (!win?.hexo.value) {
    return;
  }
  if (!win?.hexo?.serverProcess || !win?.hexo?.serverProcessPid) {
    return;
  }
  win.hexo.serverProcess.kill();
}
