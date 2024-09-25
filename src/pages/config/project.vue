<template>
  <div class="project-config">
    <h1>项目配置</h1>
    <MonacoEditor :default-value="store.configCode" language="json" />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store/config';
import MonacoEditor from '@/components/monaco-editor/monaco-editor.vue';

const store = useConfigStore();
store.initConfig();
</script>

<style scoped lang="less">
.project-config {
  height: 100%;
  width: 100%;
}
</style>
