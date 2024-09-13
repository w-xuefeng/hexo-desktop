<template>
  <div class="right-text-editor-container">
    <div style="border-bottom: 1px solid #e8e8e8">
      <div ref="editorToolbar"></div>
    </div>
    <div id="content">
      <div id="editor-container">
        <div id="title-container">
          <input v-model="title" placeholder="Article title..." />
        </div>
        <div ref="editorTextArea"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef, useTemplateRef } from 'vue';
import { createEditor, createToolbar } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

type TRichTextEditor = any;
type TRichTextEditorToolbar = any;

const emits = defineEmits<{
  'editor-initialed': [
    richTextEditor: TRichTextEditor,
    richTextEditorToolbar: TRichTextEditorToolbar
  ];
  'editor-initial-error': [error: Error];
}>();

const editor = shallowRef<TRichTextEditor>();
const toolbar = shallowRef<TRichTextEditor>();
const modelValue = defineModel<string>();
const title = defineModel<string>('title');
const editorTextArea = useTemplateRef('editorTextArea');
const editorToolbar = useTemplateRef('editorToolbar');

const editorConfig = {
  placeholder: 'Type here...',
  scroll: false,
  onChange(editor: TRichTextEditor) {
    modelValue.value = editor.getHtml();
  }
};

const initEditor = (data: string) => {
  try {
    if (!editorTextArea.value) {
      return;
    }
    editor.value = createEditor({
      selector: editorTextArea.value,
      content: [],
      html: data,
      config: editorConfig
    });

    if (!editorToolbar.value) {
      return;
    }

    toolbar.value = createToolbar({
      editor: editor.value,
      selector: editorToolbar.value,
      config: {
        excludeKeys: ['fullScreen']
      }
    });
    emits('editor-initialed', editor.value, toolbar.value);
  } catch (error) {
    console.log('initEditor Error', error);
    emits('editor-initial-error', error as Error);
  }
};

onMounted(() => {
  initEditor(modelValue.value || '');
});

onBeforeUnmount(() => {
  if (!editor.value) {
    return;
  }
  editor.value.destroy();
});
</script>

<style scoped lang="less">
.right-text-editor-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  outline: none;

  :deep(*) {
    outline: none;
  }

  :deep(img) {
    max-width: 100%;
  }

  #editor-toolbar {
    width: 100%;
    background-color: var(--rich-text-editor-toolbar-background);
    margin: 0 auto;
  }

  #content {
    height: calc(100% - 40px);
    background-color: var(--rich-text-editor-content-background);
    overflow-y: auto;
    position: relative;
  }

  #editor-container {
    width: 850px;
    margin: 30px auto 150px auto;
    background-color: var(--rich-text-editor-container-background);
    padding: 20px 50px 50px 50px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
  }

  #title-container {
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
  }

  #title-container input {
    font-size: 30px;
    border: 0;
    outline: none;
    width: 100%;
    line-height: 1;
    background: transparent;
  }

  #editor-text-area {
    min-height: 900px;
    margin-top: 20px;
  }
}
</style>
