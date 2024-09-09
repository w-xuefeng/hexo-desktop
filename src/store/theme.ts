import { watch as vueWatch } from 'vue';
import { GLStoreRef } from '@/store-change-handler';
import { IPC_CHANNEL, STORE_KEY } from '@root/shared/dicts/enums';
import { SharedStore } from '@root/shared/render-utils/storage';
import { defineStore } from 'pinia';

export type ThemeObject = {
  light: string;
  dark: string;
  auto: string;
};

export type ThemeType = keyof ThemeObject;

export const useThemeStore = defineStore('theme-store', () => {
  const theme = ref<ThemeType>(SharedStore.getSync(STORE_KEY.THEME) || 'auto');
  return {
    theme
  };
});

const GLThemeRef = {
  matchMedia: window.matchMedia('(prefers-color-scheme: light)'),
  onThemeChange: void 0 as
    | undefined
    | ((e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void)
};

const dark = () => {
  document.body.setAttribute('arco-theme', 'dark');
};

const light = () => {
  document.body.removeAttribute('arco-theme');
};

const checkTheme = (e: MediaQueryListEvent | { matches: boolean }) => {
  e.matches ? light() : dark();
  if (typeof GLThemeRef.onThemeChange === 'function') {
    GLThemeRef.onThemeChange('auto', e.matches ? 'light' : 'dark');
  }
};

const removeAutoChangeThemeEvent = () => {
  GLThemeRef.matchMedia.removeEventListener('change', checkTheme);
};

const addAutoChangeThemeEvent = () => {
  removeAutoChangeThemeEvent();
  GLThemeRef.matchMedia.addEventListener('change', checkTheme);
};

function handleLight(
  onThemeChange?: (e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void
) {
  removeAutoChangeThemeEvent();
  light();
  window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'light');
  typeof onThemeChange === 'function' && onThemeChange('light', 'light');
}

function handleDark(
  onThemeChange?: (e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void
) {
  removeAutoChangeThemeEvent();
  dark();
  window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'dark');
  typeof onThemeChange === 'function' && onThemeChange('dark', 'dark');
}

function handleAuto(
  onThemeChange?: (e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void
) {
  GLThemeRef.onThemeChange = onThemeChange;
  checkTheme(GLThemeRef.matchMedia);
  addAutoChangeThemeEvent();
  window.ipcRenderer.invoke(IPC_CHANNEL.CHANGE_THEME, 'system');
}

const switchTheme = (
  e: any,
  onThemeChange?: (e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void
) => {
  switch (e as ThemeType) {
    case 'light':
      handleLight(onThemeChange);
      break;
    case 'dark':
      handleDark(onThemeChange);
      break;
    case 'auto':
      handleAuto(onThemeChange);
      break;
  }
};

export function useTheme(
  onThemeChange?: (e: ThemeType, details: keyof Omit<ThemeObject, 'auto'>) => void
) {
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
