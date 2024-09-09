<template>
  <a-layout class="layout">
    <MenuLayout />
    <router-view />
  </a-layout>
</template>

<script setup lang="ts">
import MenuLayout from '@/components/menu-layout.vue';
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
