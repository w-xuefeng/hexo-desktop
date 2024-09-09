<template>
  <div v-if="store.currentArticle" class="content">
    <EditorToolbar />
    <div class="editor-container">
      <RichTextEditor
        v-show="store.editorType === 'richText'"
        :default-value="richTextContent"
        @editor-initialed="richTextEditorInitialed"
      />
      <MonacoEditor
        v-show="store.editorType === 'rawCode'"
        :default-value="rawContent"
        @editor-initialed="monacoEditorInitialed"
      />
    </div>
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
import RichTextEditor from '@/components/rich-text-editor/rich-text-editor.vue';
import EditorToolbar from '@/components/editor-toolbar/editor-toolbar.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const store = useArticleStore();
const richTextContent = computed({
  get: () => store.currentArticle?.content,
  set: (value: string) => {
    if (store.currentArticle) {
      store.currentArticle.content = value;
    }
  }
});
const rawContent = computed({
  get: () => store.currentArticle?.raw,
  set: (value: string) => {
    if (store.currentArticle) {
      store.currentArticle.raw = value;
    }
  }
});
const richTextEditorInitialed = (editor: any) => {
  store.richTextEditor = editor;
};
const monacoEditorInitialed = (editor: monaco.editor.IStandaloneCodeEditor) => {
  store.monacoEditor = editor;
};
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;

  .editor-container {
    width: 100%;
    height: calc(100% - var(--layout-editor-toolbar-height));
    overflow: hidden;
  }
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
