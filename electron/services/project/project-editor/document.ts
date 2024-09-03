import { GLHexo } from '../../../../shared/global-manager/hexo';
import type { IHexoDocument, IHexoQuery } from '../../../../shared/utils/types';

export function getDocument(id: string) {
  if (!GLHexo.value) {
    return;
  }
  const posts = GLHexo.value.locals.get('posts') as IHexoQuery<IHexoDocument>;
  const current = posts.data.find((e) => e._id === id);
  if (!current) {
    return;
  }
  return current.content;
}
