<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { arcoLangs, currentLocale, useSharedLocales } from '@/locales';
import { IPC_CHANNEL, LOADING_CATEGORY } from '@root/shared/dicts/enums';
import { useGLStore } from '@/store/global';
import { IconLoading } from '@arco-design/web-vue/es/icon';
import IconLoadingImage from '@/assets/imgs/loading.png';

const { t } = useSharedLocales();
const GLStore = useGLStore();
const route = useRoute();
const arcoLocale = computed(() => arcoLangs[currentLocale.value]);

window.ipcRenderer.on(
  IPC_CHANNEL.GL_LOADING,
  (_, options: { type: 'open' | 'close'; text?: string; category?: LOADING_CATEGORY }) => {
    const { type, text, category } = options || {};
    if (type === 'open') {
      GLStore.loading = true;
      GLStore.loadingText = text || t('system.loading');
      GLStore.loadingCategory = category || LOADING_CATEGORY.NORMAL_LOADING;
    }
    if (type === 'close') {
      GLStore.reset();
    }
  }
);
</script>

<template>
  <a-config-provider :locale="arcoLocale">
    <a-spin :loading="GLStore.loading" :tip="GLStore.loadingText" style="display: contents">
      <template #icon>
        <img
          v-if="GLStore.loadingCategory === LOADING_CATEGORY.INSTALLING"
          :src="IconLoadingImage"
          alt="loading"
          class="loading-icon"
        />
        <IconLoading v-else />
      </template>
      <router-view :key="route.fullPath" />
    </a-spin>
  </a-config-provider>
</template>

<style scoped lang="less">
.loading-icon {
  width: 128px;
  height: 128px;
}
</style>
