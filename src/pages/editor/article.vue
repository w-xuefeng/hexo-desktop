<template>
  <a-layout class="article-layout">
    <a-split
      v-model:size="UIState.listWidth"
      class="panel"
      :default-size="defaultListWidth"
      :min="defaultListWidth"
      :max="maxListWidth"
      @move-end="handleMoveEnd"
    >
      <template #first>
        <a-layout-sider class="layout-list">
          <ArticleList :posts="store.state.posts.data" @details="store.getContent" />
        </a-layout-sider>
      </template>
      <template #second>
        <a-layout-content class="layout-content">
          <ContentEditor />
        </a-layout-content>
      </template>
    </a-split>
  </a-layout>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/store/editor';
import { SharedStorage } from '@root/shared/render-utils/storage';
import ArticleList from '@/components/article-list.vue';
import ContentEditor from './content-editor.vue';
import { STORAGE_KEY } from '@root/shared/dicts/enums';

const defaultListWidth = 250;
const lastListWidth = SharedStorage.getSession(STORAGE_KEY.ARTICLE_LIST_WIDTH);
const maxListWidth = 0.5;

const UIState = reactive({
  listWidth: lastListWidth ? `${lastListWidth}` : defaultListWidth
});

const route = useRoute();
const store = useArticleStore();
const init = () => {
  if (route.query.path) {
    store.setPath(route.query.path as string);
  }
  store.init();
};

const handleMoveEnd = () => {
  SharedStorage.setSession(STORAGE_KEY.ARTICLE_LIST_WIDTH, UIState.listWidth);
};

init();
</script>

<style scoped lang="less">
.article-layout {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;

  .panel {
    height: 100%;
    width: 100%;
    min-width: 100%;
  }

  .layout-list {
    height: 100%;
    width: 100% !important;
    overflow: hidden;
  }
  .layout-content {
    height: 100%;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
