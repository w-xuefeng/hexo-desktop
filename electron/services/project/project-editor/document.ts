import { GLHexo } from '../../../../shared/global-manager/hexo';
import type { IHexoDocument, IHexoPostData, IHexoQuery } from '../../../../shared/utils/types';

export function getDocument(id: string) {
  if (!GLHexo.value) {
    return;
  }
  const posts = GLHexo.value.locals.get('posts') as IHexoQuery<IHexoDocument>;
  const current = posts.data.find((e) => e._id === id);
  if (!current) {
    return;
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
    tags: current.tags.data.map((e) => e.name),
    categories: current.categories.data.map((e) => e.name)
  };
}

export function createDocument(data: IHexoPostData, replace: boolean) {
  return new Promise((resolve, reject) => {
    if (!GLHexo.value) {
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
