import Hexo from 'hexo';
import { GLHexo } from '../../../../shared/global-manager/hexo';
import type { IHexoProjectBaseInfo, IHexoObject } from '../../../../shared/utils/types';

export function getHexoProjectBaseInfo(ho: IHexoObject): IHexoProjectBaseInfo {
  return {
    posts: {
      length: ho.posts.length,
      data: ho.posts.data.map((e) => ({
        id: e._id,
        title: e.title
      }))
    },
    pages: {
      length: ho.pages.length,
      data: ho.pages.data.map((e) => ({
        id: e._id,
        title: e.title
      }))
    },
    categories: {
      length: ho.categories.length,
      data: ho.categories.data.map((e) => ({
        name: e.name,
        id: e._id
      }))
    },
    tags: {
      length: ho.tags.length,
      data: ho.tags.data.map((e) => ({
        name: e.name,
        id: e._id
      }))
    },
    data: ho.data
  };
}

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
  await hexo.load();
  GLHexo.path = cwd;
  GLHexo.value = hexo;
  return getHexoProjectBaseInfo(hexo.locals.toObject() as IHexoObject);
}
