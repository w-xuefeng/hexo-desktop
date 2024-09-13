import Hexo from 'hexo';

export class GlobalHexo {
  path: string | null = null;
  value: Hexo | null = null;

  async exit() {
    this.value?.unwatch();
    await this.value?.exit();
    this.path = null;
    this.value = null;
  }
}
