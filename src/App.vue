<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { arcoLangs, currentLocale, useSharedLocales } from '@/locales';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';

const { t } = useSharedLocales();
const loading = ref(false);
const loadingText = ref(t('system.loading'));
const route = useRoute();
const arcoLocale = computed(() => arcoLangs[currentLocale.value]);

window.ipcRenderer.on(
  IPC_CHANNEL.GL_LOADING,
  (_, options: { type: 'open' | 'close'; text?: string }) => {
    const { type, text } = options || {};
    loading.value = type === 'open';
    loadingText.value = text || t('system.loading');
  }
);
</script>

<template>
  <a-config-provider :locale="arcoLocale">
    <a-spin :loading="loading" :tip="loadingText" style="display: contents">
      <router-view :key="route.fullPath" />
    </a-spin>
  </a-config-provider>
</template>

<style scoped></style>
