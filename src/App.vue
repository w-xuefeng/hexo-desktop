<script setup lang="ts">
import { arcoLangs, currentLocale } from '@/locales';
import { computed } from 'vue';
const arcoLocale = computed(() => arcoLangs[currentLocale.value]);
</script>

<template>
  <a-config-provider :locale="arcoLocale">
    <router-view :key="$route.fullPath" />
  </a-config-provider>
</template>

<style scoped></style>
