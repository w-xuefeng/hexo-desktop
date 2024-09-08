<template>
  <a-list class="list" :bordered="false" max-height="100vh">
    <a-list-item
      v-for="post in posts"
      :key="post.id"
      class="item"
      :class="{ current: post.id === store?.currentArticle?.id }"
      @click="$emit('details', post.id)"
    >
      <a-list-item-meta :title="post.title" :description="post.date"> </a-list-item-meta>
      <template #actions>
        <icon-delete />
      </template>
    </a-list-item>

    <template #empty>
      <a-empty :description="$t('system.empty')">
        <template #image>
          <img :src="IconEmpty" class="icon" />
        </template>
      </a-empty>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import IconEmpty from '@/assets/imgs/empty.svg';
import { IconDelete } from '@arco-design/web-vue/es/icon';
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
  height: 100%;
  border-left: 1px solid #2b2b2b;
  .item {
    cursor: pointer;
  }

  .current {
    background-color: rgb(154, 180, 230);
  }

  .icon {
    width: 40px;
    height: 40px;
  }

  :deep(.arco-scrollbar),
  :deep(.arco-scrollbar-container),
  :deep(.arco-list-content-wrapper:has(.arco-empty)),
  :deep(.arco-list-content:has(.arco-empty)),
  :deep(.arco-empty) {
    height: 100%;
  }
  :deep(.arco-empty) {
    display: flex;
    flex-direction: column;
  }
}
</style>
