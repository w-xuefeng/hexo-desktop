<template>
  <div class="toolbar">
    <div class="start">
      <a-radio-group v-model="store.editorType" type="button" size="large">
        <a-radio value="richText">富文本</a-radio>
        <a-radio value="rawCode">源代码</a-radio>
      </a-radio-group>
    </div>
    <div class="end">
      <a-dropdown trigger="hover">
        <a-button>预览</a-button>
        <template #content>
          <a-doption>本地预览</a-doption>
          <a-doption>在浏览器中预览</a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '@/store/editor';
const store = useArticleStore();
</script>

<style scoped lang="less">
.toolbar {
  width: 100%;
  height: var(--layout-editor-toolbar-height);
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  .start {
    display: flex;
    align-items: center;
  }
  .end {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
  }
}
</style>
