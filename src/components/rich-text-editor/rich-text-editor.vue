<template>
  <div class="right-text-editor-container">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Strike from '@tiptap/extension-strike';
import Iframe from './nodes/iframe';
import Img from './nodes/img';
import Style from './nodes/img';
import Script from './nodes/script';

const editor = shallowRef<Editor>();

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
  }>(),
  {
    defaultValue: ''
  }
);
const emits = defineEmits<{
  'editor-initialed': [richTextEditor: Editor];
}>();

const initEditor = () => {
  const richTextEditor = new Editor({
    content: props.defaultValue,
    extensions: [StarterKit, Strike, Iframe, Img, Style, Script]
  });
  emits('editor-initialed', richTextEditor);
  editor.value = richTextEditor;
};

watch(
  () => props.defaultValue,
  (data) => {
    if (editor.value) {
      editor.value.commands.setContent(data);
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  initEditor();
});

onUnmounted(() => {
  editor.value?.destroy();
});
</script>

<style scoped lang="less">
.right-text-editor-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 10px 15%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;

  :deep(*) {
    outline: none;
  }

  :deep(img) {
    max-width: 100%;
  }
}
</style>
