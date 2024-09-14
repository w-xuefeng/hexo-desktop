import { useSharedLocales } from '@/locales';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGLStore = defineStore('global-store', () => {
  const { t } = useSharedLocales();
  const loading = ref(false);
  const loadingText = ref(t('system.loading'));

  return {
    loading,
    loadingText
  };
});
