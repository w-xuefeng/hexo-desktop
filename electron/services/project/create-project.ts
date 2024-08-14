import { type ICreateProjectOptions } from '../../../shared/utils/types';
import R from '../common/r';

export default async function createProject(options: ICreateProjectOptions) {
  console.log('createProject', options);
  return R.success(options.path);
}
