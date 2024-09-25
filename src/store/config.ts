import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import { getCurrentWinId } from '@root/shared/render-utils/win-id';
import { useGLStore } from './global';

export const useConfigStore = defineStore('config-store', () => {
  const GLSore = useGLStore();
  const config = ref<Record<string, any>>();
  const themeConfig = ref<Record<string, any>>();
  const winId = getCurrentWinId();

  const configCode = computed(() => JSON.stringify(config.value, null, 2));
  const themeConfigCode = computed(() => JSON.stringify(themeConfig.value, null, 2));

  const initConfig = async () => {
    try {
      GLSore.startLoading();
      config.value = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_HEXO_CONFIG, winId);
    } finally {
      GLSore.closeLoading();
    }
  };

  const initThemeConfig = async () => {
    try {
      GLSore.startLoading();
      themeConfig.value = await window.ipcRenderer.invoke(
        IPC_CHANNEL.GET_HEXO_CONFIG,
        winId,
        'theme'
      );
    } finally {
      GLSore.closeLoading();
    }
  };

  return {
    config,
    themeConfig,
    configCode,
    themeConfigCode,
    initConfig,
    initThemeConfig
  };
});
