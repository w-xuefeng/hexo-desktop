<template>
  <a-layout class="layout">
    <a-layout-sider class="layout-menu"> </a-layout-sider>
    <a-layout-sider class="layout-list">
      <ArticleList :posts="store.state.posts.data" @details="store.getContent" />
    </a-layout-sider>
    <a-layout-content class="layout-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { useTheme } from '@/store';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/store/editor';
import ArticleList from '@/components/article-list.vue';

useTheme();
const route = useRoute();
const store = useArticleStore();
store.path = route.query.path as string;
store.init();
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
  .layout-list {
    height: 100%;
    width: var(--layout-list-sider-width) !important;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .layout-content {
    height: 100%;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
