<template>
  <div class="article-list-bar">
    <icon-folder-add class="action-icon" @click="emits('createNewArticle')" />
    <icon-refresh class="action-icon" @click="emits('refresh')" />
  </div>
</template>

<script setup lang="ts">
import { IconFolderAdd, IconRefresh } from '@arco-design/web-vue/es/icon';

const emits = defineEmits<{
  createNewArticle: [];
  refresh: [];
}>();
</script>

<style scoped lang="less">
.article-list-bar {
  height: var(--layout-list-sider-bar-height);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px 10px;
  box-sizing: border-box;
  gap: 4px;

  .action-icon {
    cursor: pointer;
  }
}
</style>
