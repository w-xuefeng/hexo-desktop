<template>
  <div ref="editorRef" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, shallowRef, watch, computed } from 'vue';
import { useTheme } from '@/store/theme';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';

const editorRef = useTemplateRef('editorRef');
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const { theme } = useTheme((_, themeDetail) => {
  if (themeDetail === 'dark') {
    monaco.editor.setTheme('vs-dark');
  }
  if (themeDetail === 'light') {
    monaco.editor.setTheme('default');
  }
}).watch();

const editorTheme = computed(() => {
  if (theme.value === 'dark') {
    return 'vs-dark';
  }
  if (theme.value === 'light') {
    return 'default';
  }
  if (theme.value === 'auto') {
    const matchMedia = window.matchMedia('(prefers-color-scheme: light)');
    return matchMedia.matches ? 'default' : 'vs-dark';
  }
  return 'default';
});

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
  }>(),
  {
    defaultValue: ''
  }
);
const emits = defineEmits<{
  'editor-initialed': [monacoEditor: monaco.editor.IStandaloneCodeEditor];
}>();

const initEditor = () => {
  if (!editorRef.value) {
    return;
  }
  const monacoEditor = monaco.editor.create(editorRef.value, {
    value: props.defaultValue,
    language: 'markdown',
    automaticLayout: true,
    theme: editorTheme.value
  });
  emits('editor-initialed', monacoEditor);
  editor.value = monacoEditor;
};

watch(
  () => props.defaultValue,
  (data) => {
    editor.value?.setValue?.(data);
  }
);

onMounted(() => {
  initEditor();
});
</script>

<style scoped lang="less">
.monaco-editor-container {
  height: 100%;
}
</style>
