<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { arcoLangs, currentLocale, useSharedLocales } from '@/locales';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import { useGLStore } from '@/store/global';

const { t } = useSharedLocales();
const GLStore = useGLStore();
const route = useRoute();
const arcoLocale = computed(() => arcoLangs[currentLocale.value]);

window.ipcRenderer.on(
  IPC_CHANNEL.GL_LOADING,
  (_, options: { type: 'open' | 'close'; text?: string }) => {
    const { type, text } = options || {};
    GLStore.loading = type === 'open';
    GLStore.loadingText = text || t('system.loading');
    if (type === 'close') {
      GLStore.loadingText = t('system.loading');
    }
  }
);
</script>

<template>
  <a-config-provider :locale="arcoLocale">
    <a-spin :loading="GLStore.loading" :tip="GLStore.loadingText" style="display: contents">
      <router-view :key="route.fullPath" />
    </a-spin>
  </a-config-provider>
</template>

<style scoped></style>
