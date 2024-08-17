import path from 'node:path';
import os from 'node:os';

export const pkgName = 'hexo-desktop';

export function filePath(type: string, ...filePath: string[]) {
  return path.join(os.homedir(), pkgName, type, ...filePath);
}
