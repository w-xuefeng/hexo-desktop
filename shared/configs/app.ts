import pkg from '../../package.json';
import { omit } from '../utils';

export const PKG_CONFIG = omit(pkg, ['scripts', 'dependencies', 'devDependencies']);

export const CONFIG_APP = {
  appName: 'Hexo 桌面客户端'
};
