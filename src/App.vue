<script setup lang="ts">
import { arcoLangs, currentLocale } from '@/locales';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const fullPath = route.fullPath;
const arcoLocale = computed(() => arcoLangs[currentLocale.value]);
</script>

<template>
  <a-config-provider :locale="arcoLocale">
    <router-view :key="fullPath" />
  </a-config-provider>
</template>

<style scoped></style>
