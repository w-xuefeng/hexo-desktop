import Hexo from 'hexo';
import logger from '../service-utils/logger';
import { ChildProcess } from 'node:child_process';

export class GlobalHexo {
  path: string | null = null;
  value: Hexo | null = null;
  serverProcess: ChildProcess | null = null;
  serverProcessPid?: number | null = null;
  serverProcessPort: number | null = null;

  #reset() {
    this.serverProcess = null;
    this.serverProcessPort = null;
    this.serverProcessPid = null;
    this.path = null;
    this.value = null;
  }

  async exit(cause?: string) {
    logger(
      `[hexo exit]: ${JSON.stringify({
        path: this.path,
        serverPid: this.serverProcessPid,
        cause
      })}`
    );
    this.serverProcess?.kill();
    this.value?.unwatch();
    await this.value?.exit();
    this.#reset();
  }
}
