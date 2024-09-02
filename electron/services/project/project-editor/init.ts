import Hexo from 'hexo';
import { GLHexo } from '../../../../shared/global-manager/hexo';

export async function initHexoEditor(
  cwd: string,
  options?: {
    debug?: boolean;
    safe?: boolean;
    silent?: boolean;
    draft?: boolean;
    drafts?: boolean;
    _?: string[];
    output?: string;
    config?: string;
    [key: string]: any;
  }
) {
  const hexo = new Hexo(cwd, options);
  await hexo.init();
  GLHexo.value = hexo;
}
