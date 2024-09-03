import Hexo from 'hexo';

export class GlobalHexo {
  path: string | null = null;
  value: Hexo | null = null;
}

export const GLHexo = new GlobalHexo();
