<template>
  <a-select v-if="!hidden" v-model="theme">
    <a-option value="light"> {{ $t('theme.light') }} </a-option>
    <a-option value="dark"> {{ $t('theme.dark') }} </a-option>
    <a-option value="auto"> {{ $t('theme.auto') }} </a-option>
  </a-select>
</template>

<script setup lang="ts">
import { useTheme } from '@/store';

withDefaults(defineProps<{ hidden?: boolean }>(), {
  hidden: false
});

const { theme } = useTheme();
</script>

<style scoped lang="less"></style>
