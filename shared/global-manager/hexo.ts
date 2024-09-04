import Hexo from 'hexo';

export class GlobalHexo {
  path: string | null = null;
  value: Hexo | null = null;

  async exit() {
    await this.value?.exit();
    this.path = null;
    this.value = null;
  }
}

export const GLHexo = new GlobalHexo();
