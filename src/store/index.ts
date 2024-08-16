import { IPC_CHANNEL, STORE_KEY } from '@root/shared/dicts/enums';
import { SharedStore } from '@root/shared/render-utils/storage';

export type ThemeType = 'light' | 'dark' | 'auto';

export function useTheme() {
  const matchMedia = window.matchMedia('(prefers-color-scheme: light)');
  const theme = ref<ThemeType>(SharedStore.getSync(STORE_KEY.THEME) || 'auto');
  let themeChangeFromStore = false;

  const dark = () => {
    document.body.setAttribute('arco-theme', 'dark');
  };

  const light = () => {
    document.body.removeAttribute('arco-theme');
  };

  const checkTheme = (e: MediaQueryListEvent | { matches: boolean }) => {
    e.matches ? light() : dark();
  };

  const removeAutoChangeThemeEvent = () => {
    matchMedia.removeEventListener('change', checkTheme);
  };

  const addAutoChangeThemeEvent = () => {
    removeAutoChangeThemeEvent();
    matchMedia.addEventListener('change', checkTheme);
  };

  const switchTheme = (e: any) => {
    switch (e as ThemeType) {
      case 'light':
        removeAutoChangeThemeEvent();
        light();
        break;
      case 'dark':
        removeAutoChangeThemeEvent();
        dark();
        break;
      case 'auto':
        checkTheme(matchMedia);
        addAutoChangeThemeEvent();
        break;
    }
  };

  watch(theme, (e) => {
    switchTheme(e);
    if (themeChangeFromStore) {
      themeChangeFromStore = false;
    } else {
      SharedStore.set(STORE_KEY.THEME, e);
    }
  });

  window.ipcRenderer.on(IPC_CHANNEL.STORE_CHANGED, (_, store) => {
    if (store.theme !== theme.value) {
      themeChangeFromStore = true;
      theme.value = store.theme;
    }
  });

  switchTheme(theme.value);

  return {
    theme,
    switchTheme
  };
}
