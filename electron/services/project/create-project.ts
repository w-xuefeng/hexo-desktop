import { createIndependentWindow } from '../../window/independent-win';
import { type ICreateProjectOptions } from '../../../shared/utils/types';
import R from '../common/r';

export function openCreateProjectPanel(
  routePath: string,
  options?: Partial<Electron.BrowserWindowConstructorOptions>
) {
  return createIndependentWindow(routePath, options);
}

export async function createProject(options: ICreateProjectOptions) {
  console.log('createProject', options);
  return R.success(options.path);
}
