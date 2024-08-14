<template>
  <a-select v-if="!hidden" v-model="theme" @change="switchTheme">
    <a-option value="light"> {{ $t('theme.light') }} </a-option>
    <a-option value="dark"> {{ $t('theme.dark') }} </a-option>
    <a-option value="auto"> {{ $t('theme.auto') }} </a-option>
  </a-select>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useTheme, type ThemeType } from '@/store';

const matchMedia = window.matchMedia('(prefers-color-scheme: light)');

const checkTheme = (e: MediaQueryListEvent | { matches: boolean }) => {
  e.matches ? light() : dark();
};

withDefaults(defineProps<{ hidden?: boolean }>(), {
  hidden: false
});

const { theme } = useTheme();

const dark = () => {
  document.body.setAttribute('arco-theme', 'dark');
};

const light = () => {
  document.body.removeAttribute('arco-theme');
};

const removeAutoChangeThemeEvent = () => {
  matchMedia.removeEventListener('change', checkTheme);
};

const addAutoChangeThemeEvent = () => {
  removeAutoChangeThemeEvent();
  matchMedia.addEventListener('change', checkTheme);
};

const switchTheme = (
  e:
    | string
    | number
    | boolean
    | Record<string, any>
    | (string | number | boolean | Record<string, any>)[]
) => {
  switch (e as ThemeType) {
    case 'light':
      removeAutoChangeThemeEvent();
      light();
      break;
    case 'dark':
      removeAutoChangeThemeEvent();
      dark();
      break;
    case 'auto':
      checkTheme(matchMedia);
      addAutoChangeThemeEvent();
      break;
  }
};

onMounted(() => {
  switchTheme(theme.value);
});

onUnmounted(() => {
  if (theme.value === 'auto') {
    removeAutoChangeThemeEvent();
  }
});
</script>

<style scoped lang="less"></style>
