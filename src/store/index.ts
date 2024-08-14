import { STORAGE_KEY } from '@root/shared/dicts/enums';
import { SharedStorage } from '@root/shared/render-utils/storage';

export type ThemeType = 'light' | 'dark' | 'auto';

export function useTheme() {
  const theme = ref<ThemeType>(
    (SharedStorage.getStorage(STORAGE_KEY.THEME) || 'auto') as ThemeType
  );
  watch(theme, (e) => {
    SharedStorage.setStorage(STORAGE_KEY.THEME, e);
  });
  return {
    theme
  };
}
