<template>
  <div class="theme-config">
    <h1>主题配置</h1>
    <MonacoEditor :default-value="store.themeConfigCode" language="json" />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store/config';
import MonacoEditor from '@/components/monaco-editor/monaco-editor.vue';

const store = useConfigStore();
store.initThemeConfig();
</script>

<style scoped lang="less">
.theme-config {
  height: 100%;
  width: 100%;
}
</style>
