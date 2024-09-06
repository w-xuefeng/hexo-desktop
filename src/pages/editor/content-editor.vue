<template>
  <div class="content">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArticleStore } from '@/store/editor';
const store = useArticleStore();
const content = computed(() => JSON.stringify(store.currentArticle, null, 2));
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  white-space: pre-line;
  padding: 14px;
}
</style>
