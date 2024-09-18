import { useSharedLocales } from '@/locales';
import { LOADING_CATEGORY } from '@root/shared/dicts/enums';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGLStore = defineStore('global-store', () => {
  const { t } = useSharedLocales();
  const loading = ref(false);
  const loadingText = ref(t('system.loading'));
  const loadingCategory = ref(LOADING_CATEGORY.NORMAL_LOADING);

  const startLoading = (text?: string, category?: LOADING_CATEGORY) => {
    loading.value = true;
    loadingText.value = text || t('system.loading');
    loadingCategory.value = category || LOADING_CATEGORY.NORMAL_LOADING;
  };

  const closeLoading = () => {
    loading.value = false;
    loadingText.value = t('system.loading');
    loadingCategory.value = LOADING_CATEGORY.NORMAL_LOADING;
  };

  return {
    t,
    startLoading,
    closeLoading,
    loading,
    loadingText,
    loadingCategory
  };
});
