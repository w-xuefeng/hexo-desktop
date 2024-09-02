import Hexo from 'hexo';

export class GlobalHexo {
  value: Hexo | null = null;
}

export const GLHexo = new GlobalHexo();
