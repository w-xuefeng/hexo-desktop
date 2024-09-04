<template>
  <a-list class="list">
    <a-list-item
      v-for="post in posts"
      :key="post.id"
      class="item"
      :class="{ current: post.id === store?.currentArticle?.id }"
      @click="$emit('details', post.id)"
    >
      <a-list-item-meta :title="post.title" :description="post.date"> </a-list-item-meta>
      <template #actions>
        <icon-edit />
        <icon-delete />
      </template>
    </a-list-item>
  </a-list>
</template>

<script setup lang="ts">
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
import { useArticleStore } from '@/store/editor';
import type { IHexoPostsListItem } from '@root/shared/utils/types';

defineProps<{
  posts: IHexoPostsListItem[];
}>();

defineEmits<{
  details: [id: string];
}>();

const store = useArticleStore();
</script>

<style scoped lang="less">
.list {
  min-height: 100%;
  .item {
    cursor: pointer;
  }

  .current {
    background-color: rgb(154, 180, 230);
  }
}
</style>
