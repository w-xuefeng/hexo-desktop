<template>
  <div v-if="store.currentArticle" class="content">
    <EditorToolbar :unsupport-rich-text-editor="unsupportRichTextEditor" />
    <div
      :class="[
        'editor-container',
        {
          'editor-container-with-preview-panel': previewInPanel
        }
      ]"
    >
      <div class="editor-inner-container">
        <RichTextEditor
          v-if="store.editorType === 'richText' && !unsupportRichTextEditor"
          :key="`rich-text-content-${locale}-${store.currentArticle.id}`"
          v-model:model-value="richTextContent"
          v-model:title="richTextTitle"
          @editor-initialed="richTextEditorInitialed"
          @editor-initial-error="handleRichTextEditorInitialError"
        />
        <MonacoEditor
          v-if="store.editorType === 'rawCode' || unsupportRichTextEditor"
          :key="`raw-${store.currentArticle.id}`"
          :default-value="rawContent"
          @editor-initialed="monacoEditorInitialed"
        />
      </div>
      <PreviewPanel
        v-if="previewInPanel"
        :src="store.previewInPanelFullPath"
        @close="store.hidePreviewPanel"
        @export="store.exportPreviewPanel"
      />
    </div>
  </div>
  <a-empty v-else :description="t('waringTips.selectOrCreateArticle')" class="empty">
    <template #image>
      <img :src="IconEmpty" class="empty-icon" />
    </template>
  </a-empty>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconEmpty from '@/assets/imgs/empty.svg';
import { useArticleStore } from '@/store/editor';
import { useSharedLocales } from '@/locales';
import MonacoEditor from '@/components/monaco-editor/monaco-editor.vue';
import RichTextEditor from '@/components/rich-text-editor/rich-text-editor.vue';
import EditorToolbar from '@/components/editor-toolbar/editor-toolbar.vue';
import PreviewPanel from './preview-panel.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const store = useArticleStore();
const { t, locale } = useSharedLocales();

const unsupportRichTextEditor = computed(() => {
  return (
    ['<style', '<script'].some((e) => store.currentArticle?.raw.includes(e)) ||
    store.richTextEditorInitialError
  );
});

const previewInPanel = computed(() => !!(store.previewInPanel && store.previewInPanelFullPath));

const richTextContent = computed({
  get: () => store.currentArticle?.content,
  set: (value: string) => {
    if (store.currentArticle) {
      store.currentArticle.content = value;
    }
  }
});
const richTextTitle = computed({
  get: () => store.currentArticle?.title,
  set: (value: string) => {
    if (store.currentArticle) {
      store.currentArticle.title = value;
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
const handleRichTextEditorInitialError = () => {
  store.richTextEditorInitialError = true;
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
    display: flex;
    .editor-inner-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .editor-container-with-preview-panel {
    .editor-inner-container {
      width: var(--layout-editor-inner-container-with-preview-width);
    }
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
