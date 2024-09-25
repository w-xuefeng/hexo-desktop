import { GLWins } from '../../../../shared/global-manager/wins';

export function getHexoConfig(winId: string, type?: 'hexo' | 'theme') {
  if (type === 'theme') {
    return getHexoThemeConfig(winId);
  }
  return getHexoProjectConfig(winId);
}

export function getHexoProjectConfig(winId: string) {
  const mainWin = GLWins.getMainWin(winId);
  const GLHexo = mainWin?.hexo;
  if (!GLHexo?.value) {
    return;
  }
  return GLHexo.value.config;
}

export function getHexoThemeConfig(winId: string) {
  const mainWin = GLWins.getMainWin(winId);
  const GLHexo = mainWin?.hexo;
  if (!GLHexo?.value) {
    return;
  }
  return GLHexo.value.theme.config;
}
