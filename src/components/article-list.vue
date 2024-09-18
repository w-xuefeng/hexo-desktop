<template>
  <a-list class="list" :bordered="false" max-height="100vh" :loading="loading">
    <a-list-item
      v-for="post in sortedPosts"
      :key="post.id"
      class="item"
      :class="{ current: post.id === currentArticle?.id }"
      @click="select(post, $event)"
    >
      <a-list-item-meta :title="post.title" :description="post.date"> </a-list-item-meta>
      <template #actions>
        <a-popconfirm
          :content="t('waringTips.areYouSureDeleteArticle')"
          @ok="$emit('deleteArticle', post)"
        >
          <icon-delete />
        </a-popconfirm>
      </template>
    </a-list-item>

    <template #empty>
      <a-empty :description="t('system.empty')">
        <template #image>
          <img :src="IconEmpty" class="icon" />
        </template>
      </a-empty>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconEmpty from '@/assets/imgs/empty.svg';
import { IconDelete } from '@arco-design/web-vue/es/icon';
import { useSharedLocales } from '@/locales';
import dayjs from 'dayjs';
import type { IHexoPostsListItem } from '@root/shared/utils/types';

const { t } = useSharedLocales();

const props = withDefaults(
  defineProps<{
    posts: IHexoPostsListItem[];
    currentArticle?: IHexoPostsListItem;
    loading?: boolean;
  }>(),
  {
    currentArticle: void 0,
    loading: false
  }
);

const emits = defineEmits<{
  details: [id: string];
  deleteArticle: [post: IHexoPostsListItem];
}>();

const sortedPosts = computed(() => {
  return props.posts.toSorted((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? -1 : 1));
});

const select = (post: IHexoPostsListItem, e: MouseEvent) => {
  if (['path', 'svg'].includes((e.target as HTMLElement)?.nodeName.toLocaleLowerCase())) {
    return;
  }
  emits('details', post.id);
};
</script>

<style scoped lang="less">
.list {
  height: calc(100% - var(--layout-list-sider-bar-height));
  .item {
    cursor: pointer;
  }

  .current {
    background-color: rgb(154, 180, 230);
  }

  .icon {
    width: 80px;
    height: 80px;
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
