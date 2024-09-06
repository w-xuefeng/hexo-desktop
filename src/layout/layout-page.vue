<template>
  <a-layout class="layout">
    <MenuLayout />
    <router-view />
  </a-layout>
</template>

<script setup lang="ts">
import { useTheme } from '@/store/theme';
import MenuLayout from '@/components/menu-layout.vue';
useTheme().watch();
</script>

<style scoped lang="less">
.layout {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
