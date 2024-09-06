import { GLWins } from '../../../../shared/global-manager/wins';
import type {
  IHexoDocument,
  IHexoPostData,
  IHexoPostsDetailItem,
  IHexoQuery
} from '../../../../shared/utils/types';

export function getDocument(winId: string, id: string) {
  const mainWin = GLWins.getMainWin(winId);
  const GLHexo = mainWin?.hexo;
  if (!GLHexo?.value) {
    return;
  }
  const posts = GLHexo.value.locals.get('posts') as IHexoQuery<IHexoDocument>;
  const current = posts.data.find((e) => e._id === id);
  if (!current) {
    return;
  }
  if (process.platform === 'darwin') {
    mainWin?.win?.setRepresentedFilename(current.full_source);
  }
  return {
    id: current._id,
    title: current.title,
    source: current.source,
    raw: current.raw,
    slug: current.slug,
    published: current.published,
    date: current.date.format('YYYY-MM-DD HH:mm:ss'),
    updated: current.updated.format('YYYY-MM-DD HH:mm:ss'),
    comments: current.comments,
    layout: current.layout,
    photos: current.photos,
    content: current.content,
    excerpt: current.excerpt,
    more: current.more,
    path: current.path,
    permalink: current.permalink,
    full_source: current.full_source,
    asset_dir: current.asset_dir,
    tags: current.tags?.data?.map((e) => e.name) || [],
    categories: current.categories?.data?.map((e) => e.name) || []
  } as IHexoPostsDetailItem;
}

export function createDocument(winId: string, data: IHexoPostData, replace: boolean) {
  return new Promise((resolve, reject) => {
    const GLHexo = GLWins.getMainWin(winId)?.hexo;
    if (!GLHexo?.value) {
      reject();
      return;
    }
    GLHexo.value.post.create(data, replace, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
