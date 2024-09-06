<template>
  <a-layout class="layout">
    <a-layout-sider class="layout-menu"> </a-layout-sider>
    <ArticleLayout :path="path" />
  </a-layout>
</template>

<script setup lang="ts">
import { useTheme } from '@/store';
import { useRoute } from 'vue-router';
import ArticleLayout from '@/components/article-layout.vue';
useTheme();
const route = useRoute();
const path = route.query.path as string;
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
  .layout-menu {
    height: 100%;
    width: var(--layout-menu-sider-width) !important;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
