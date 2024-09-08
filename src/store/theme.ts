import { watch as vueWatch } from 'vue';
import { GLStoreRef } from '@/store-change-handler';
import { IPC_CHANNEL, STORE_KEY } from '@root/shared/dicts/enums';
import { SharedStore } from '@root/shared/render-utils/storage';
import { defineStore } from 'pinia';

export type ThemeType = 'light' | 'dark' | 'auto';

export const useThemeStore = defineStore('theme-store', () => {
  const theme = ref<ThemeType>(SharedStore.getSync(STORE_KEY.THEME) || 'auto');
  return {
    theme
  };
});

const dark = () => {
  document.body.setAttribute('arco-theme', 'dark');
};

const light = () => {
  document.body.removeAttribute('arco-theme');
};

const checkTheme = (e: MediaQueryListEvent | { matches: boolean }) => {
  e.matches ? light() : dark();
};

const matchMedia = window.matchMedia('(prefers-color-scheme: light)');

const removeAutoChangeThemeEvent = () => {
  matchMedia.removeEventListener('change', checkTheme);
};

const addAutoChangeThemeEvent = () => {
  removeAutoChangeThemeEvent();
  matchMedia.addEventListener('change', checkTheme);
};

const switchTheme = (
  e: any,
  onThemeChange?: (e: ThemeType, details: Omit<ThemeType, 'auto'>) => void
) => {
  switch (e as ThemeType) {
    case 'light':
      removeAutoChangeThemeEvent();
      light();
      window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'light');
      typeof onThemeChange === 'function' && onThemeChange('light', 'light');
      break;
    case 'dark':
      removeAutoChangeThemeEvent();
      dark();
      window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'dark');
      typeof onThemeChange === 'function' && onThemeChange('dark', 'dark');
      break;
    case 'auto':
      checkTheme(matchMedia);
      addAutoChangeThemeEvent();
      window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'system');
      typeof onThemeChange === 'function' &&
        onThemeChange('auto', matchMedia.matches ? 'light' : 'dark');
      break;
  }
};

export function useTheme(onThemeChange?: (e: ThemeType, details: Omit<ThemeType, 'auto'>) => void) {
  const store = useThemeStore();
  const theme = computed({
    get: () => {
      return store.theme;
    },
    set: (value: ThemeType) => {
      store.theme = value;
    }
  });
  const watch = () => {
    vueWatch(
      () => store.theme,
      (e) => {
        switchTheme(e, onThemeChange);
        if (GLStoreRef.themeChangeFromStore) {
          GLStoreRef.themeChangeFromStore = false;
        } else {
          SharedStore.set(STORE_KEY.THEME, e);
        }
      }
    );
    switchTheme(store.theme);

    return {
      theme,
      switchTheme
    };
  };
  return {
    theme,
    switchTheme,
    watch
  };
}
