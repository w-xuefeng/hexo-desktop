<template>
  <div ref="editorRef" class="right-text-editor-container">
    {{ defaultValue }}
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  useTemplateRef,
  shallowRef
  // watch,
  // computed
} from 'vue';
// import { useTheme } from '@/store/theme';

type TRichTextEditor = any;

const editorRef = useTemplateRef('editorRef');
const editor = shallowRef<TRichTextEditor>();
// const { theme } = useTheme((_, themeDetail) => {
//   if (themeDetail === 'dark') {
//     monaco.editor.setTheme('vs-dark');
//   }
//   if (themeDetail === 'light') {
//     monaco.editor.setTheme('default');
//   }
// }).watch();

// const editorTheme = computed(() => {
//   if (theme.value === 'dark') {
//     return 'vs-dark';
//   }
//   if (theme.value === 'light') {
//     return 'default';
//   }
//   if (theme.value === 'auto') {
//     const matchMedia = window.matchMedia('(prefers-color-scheme: light)');
//     return matchMedia.matches ? 'default' : 'vs-dark';
//   }
//   return 'default';
// });

// const props =
withDefaults(
  defineProps<{
    defaultValue?: string;
  }>(),
  {
    defaultValue: ''
  }
);
const emits = defineEmits<{
  'editor-initialed': [richTextEditor: TRichTextEditor];
}>();

const initEditor = () => {
  if (!editorRef.value) {
    return;
  }
  const richTextEditor = {};
  emits('editor-initialed', richTextEditor);
  editor.value = richTextEditor;
};

// watch(
//   () => props.defaultValue,
//   (data) => {
//     editor.value?.setValue?.(data);
//   }
// );

onMounted(() => {
  initEditor();
});
</script>

<style scoped lang="less">
.right-text-editor-container {
  height: 100%;
}
</style>
