<template>
  <div v-if="src" class="preview-panel-container">
    <div class="address-bar">
      <a-input v-model:model-value="internalSrc" :default-value="src" :style="{ width: '100%' }">
        <template #append>
          <IconRefresh class="refresh" @click="refreshKey++" />
        </template>
      </a-input>
      <a-button @click="emits('export')">
        <template #icon>
          <IconExport />
        </template>
      </a-button>
      <a-button @click="emits('close')">
        <template #icon>
          <IconClose />
        </template>
      </a-button>
    </div>
    <iframe :key="refreshKey" :src="internalSrc" frameborder="0" class="preview-panel"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconRefresh, IconClose, IconExport } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  src?: string;
}>();

const emits = defineEmits<{
  close: [];
  export: [];
}>();

const internalSrc = ref(props.src);
const refreshKey = ref(0);

watch(
  () => props.src,
  (src) => {
    if (src) {
      internalSrc.value = src;
    }
  }
);
</script>

<style scoped lang="less">
.preview-panel-container {
  height: 100%;
  width: calc(100% - var(--layout-editor-inner-container-with-preview-width));
  display: flex;
  flex-direction: column;
  gap: 2px;
  .address-bar {
    width: 100%;
    display: flex;
    align-items: center;

    .refresh {
      cursor: pointer;
    }
  }
  .preview-panel {
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
  }
}
</style>
