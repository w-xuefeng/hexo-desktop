<template>
  <div v-if="store.currentArticle" class="content">
    <MonacoEditor :default-value="rawContent" @editor-initialed="editorInitialed" />
  </div>
  <a-empty v-else :description="$t('waringTips.selectOrCreateArticle')" class="empty">
    <template #image>
      <img :src="IconEmpty" class="empty-icon" />
    </template>
  </a-empty>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconEmpty from '@/assets/imgs/empty.svg';
import { useArticleStore } from '@/store/editor';
import MonacoEditor from '@/components/monaco-editor/monaco-editor.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const store = useArticleStore();
const rawContent = computed({
  get: () => store.currentArticle?.raw,
  set: (value: string) => {
    if (store.currentArticle) {
      store.currentArticle.raw = value;
    }
  }
});
const editorInitialed = (editor: monaco.editor.IStandaloneCodeEditor) => {
  store.monacoEditor = editor;
};
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  white-space: pre-line;
  padding: 14px;
}
.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .empty-icon {
    width: 80px;
    height: 80px;
  }
}
</style>
