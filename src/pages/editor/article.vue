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
          <ArticleListBar @create-new-article="createArticle" @refresh="store.refreshList" />
          <ArticleList
            :key="`article-list-${store.state.posts.length}`"
            :current-article="store.currentArticle"
            :loading="store.listLoading"
            :posts="store.state.posts.data"
            @details="store.getContent"
            @delete-article="deleteArticle"
          />
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
import { ref, h, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/store/editor';
import { SharedStorage } from '@root/shared/render-utils/storage';
import { STORAGE_KEY } from '@root/shared/dicts/enums';
import { Modal } from '@arco-design/web-vue';
import { useSharedLocales } from '@/locales';
import ArticleList from '@/components/article-list.vue';
import ContentEditor from '@/components/content-editor.vue';
import ArticleListBar from '@/components/article-list-bar.vue';
import NewArticleForm from '@/components/new-article-form.vue';
import type { IHexoPostsListItem } from '@root/shared/utils/types';

const defaultListWidth = 250;
const lastListWidth = SharedStorage.getSession(STORAGE_KEY.ARTICLE_LIST_WIDTH);
const maxListWidth = 0.5;

const UIState = reactive({
  listWidth: lastListWidth ? `${lastListWidth}` : defaultListWidth
});

const route = useRoute();
const store = useArticleStore();
const { t } = useSharedLocales();
const init = () => {
  if (route.query.path) {
    store.setPath(route.query.path as string);
  }
  store.init();
};

const handleMoveEnd = () => {
  SharedStorage.setSession(STORAGE_KEY.ARTICLE_LIST_WIDTH, UIState.listWidth);
};

const createArticle = () => {
  const formRef = ref();
  Modal.open({
    title: t('editor.newArticle'),
    content: () => h(NewArticleForm, { ref: formRef }),
    cancelText: t('operate.cancel'),
    okText: t('operate.confirm'),
    onBeforeOk: async (done) => {
      const rs = await formRef.value?.validate?.();
      if (!rs) {
        done(false);
      }
      await store.createArticle(rs);
      done(true);
    }
  });
};

const deleteArticle = (article: IHexoPostsListItem) => {
  return store.deleteArticle(article);
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
