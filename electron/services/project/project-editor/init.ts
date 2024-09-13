import Hexo from 'hexo';
import { GLWins } from '../../../../shared/global-manager/wins';
import type {
  IHexoProjectBaseInfo,
  IHexoObject,
  IHexoDocument,
  IHexoPostsListItem
} from '../../../../shared/utils/types';

export function getHexoPostsListItem(e: IHexoDocument): IHexoPostsListItem {
  return {
    id: e._id,
    title: e.title,
    source: e.source,
    slug: e.slug,
    published: e.published,
    date: e.date.format('YYYY-MM-DD HH:mm:ss'),
    updated: e.updated.format('YYYY-MM-DD HH:mm:ss'),
    comments: e.comments,
    layout: e.layout,
    photos: e.photos,
    path: e.path,
    permalink: e.permalink,
    full_source: e.full_source,
    asset_dir: e.asset_dir,
    tags: e.tags?.data?.map((t) => t.name) || [],
    categories: e.categories?.data?.map((c) => c.name) || []
  };
}

export function getHexoProjectBaseInfo(ho: IHexoObject): IHexoProjectBaseInfo {
  return {
    posts: {
      length: ho.posts.length,
      data: ho.posts.data.map(getHexoPostsListItem)
    },
    pages: {
      length: ho.pages.length,
      data: ho.pages.data.map(getHexoPostsListItem)
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
  winId: string,
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
  await hexo.watch();
  const win = GLWins.getMainWin(winId);
  if (win?.hexo) {
    win.hexo.path = cwd;
    win.hexo.value = hexo;
  }
  return getHexoProjectBaseInfo(hexo.locals.toObject() as IHexoObject);
}

export async function refreshBaseInfo(winId: string) {
  const win = GLWins.getMainWin(winId);
  if (!win?.hexo.value) {
    return;
  }
  return getHexoProjectBaseInfo(win.hexo.value.locals.toObject() as IHexoObject);
}
