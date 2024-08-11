<template>
  <a-switch
    v-model="darkModel"
    @change="switchTheme"
  >
    <template #checked> Dark </template>
    <template #unchecked> Light </template>
  </a-switch>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const darkModel = ref(false);

const dark = () => {
  document.body.setAttribute(
    'arco-theme',
    'dark'
  );
};

const light = () => {
  document.body.removeAttribute('arco-theme');
};

const switchTheme = (
  e: string | number | boolean
) => {
  e ? dark() : light();
};

const matchMedia = window.matchMedia(
  '(prefers-color-scheme: light)'
);
const checkTheme = (
  e: MediaQueryListEvent | { matches: boolean }
) => {
  darkModel.value = !e.matches;
  e.matches ? light() : dark();
};

onMounted(() => {
  checkTheme(matchMedia);
  matchMedia.addEventListener(
    'change',
    checkTheme
  );
});

onUnmounted(() => {
  matchMedia.removeEventListener(
    'change',
    checkTheme
  );
});
</script>

<style scoped></style>
