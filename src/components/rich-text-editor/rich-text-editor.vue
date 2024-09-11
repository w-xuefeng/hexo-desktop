<template>
  <div class="right-text-editor-container">
    <div style="border-bottom: 1px solid #e8e8e8">
      <div id="editor-toolbar"></div>
    </div>
    <div id="content">
      <div id="editor-container">
        <div id="title-container">
          <input v-model="title" placeholder="Article title..." />
        </div>
        <div id="editor-text-area" @click="handleClick"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef } from 'vue';
import { createEditor, createToolbar } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

type TRichTextEditor = any;
type TRichTextEditorToolbar = any;

const emits = defineEmits<{
  'editor-initialed': [
    richTextEditor: TRichTextEditor,
    richTextEditorToolbar: TRichTextEditorToolbar
  ];
}>();

const editor = shallowRef<TRichTextEditor>();
const toolbar = shallowRef<TRichTextEditor>();
const modelValue = defineModel<string>();
const title = defineModel<string>('title');

const editorConfig = {
  placeholder: 'Type here...',
  scroll: false,
  onChange(editor: TRichTextEditor) {
    modelValue.value = editor.getHtml();
  }
};

const handleClick = () => {
  editor.value?.blur();
  editor.value?.focus(true);
};

const initEditor = (data: string) => {
  editor.value = createEditor({
    selector: '#editor-text-area',
    content: [],
    html: data,
    config: editorConfig
  });

  toolbar.value = createToolbar({
    editor: editor.value,
    selector: '#editor-toolbar',
    config: {
      excludeKeys: ['fullScreen']
    }
  });
  emits('editor-initialed', editor.value, toolbar.value);
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
    background-color: #fcfcfc;
    margin: 0 auto;
  }

  #content {
    height: calc(100% - 40px);
    background-color: rgb(245, 245, 245);
    overflow-y: auto;
    position: relative;
  }

  #editor-container {
    width: 850px;
    margin: 30px auto 150px auto;
    background-color: #fff;
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
  }

  #editor-text-area {
    min-height: 900px;
    margin-top: 20px;
  }
}
</style>
