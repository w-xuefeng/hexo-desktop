import { STORE_KEY } from '@root/shared/dicts/enums';
import { useThemeStore } from './store/theme';
import { setI18nLanguage, useSharedLocales } from './locales';

export const GLStoreRef = {
  themeChangeFromStore: false,
  langChangeFromStore: false
};

export function storeChangeHandler(store: Record<string, any>) {
  const themeStore = useThemeStore();
  if (store[STORE_KEY.THEME] !== themeStore.theme) {
    GLStoreRef.themeChangeFromStore = true;
    themeStore.theme = store[STORE_KEY.THEME];
  }

  const i18n = useSharedLocales();
  if (store[STORE_KEY.LANG] !== i18n.locale.value) {
    GLStoreRef.langChangeFromStore = true;
    setI18nLanguage(store[STORE_KEY.LANG]);
  }
}
