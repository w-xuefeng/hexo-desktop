<template>
  <div class="toolbar">
    <div class="start">
      <a-radio-group v-model="store.editorType" type="button" size="large">
        <a-radio value="richText" :disabled="unsupportRichTextEditor">
          <span v-if="unsupportRichTextEditor">{{ t('editorToolbar.onlyRawCode') }}</span>
          <span v-else>{{ t('editorToolbar.richText') }}</span>
        </a-radio>
        <a-radio value="rawCode">{{ t('editorToolbar.rawCode') }}</a-radio>
      </a-radio-group>
    </div>
    <div class="end">
      <a-dropdown trigger="hover">
        <a-button>{{ t('editorToolbar.preview') }}</a-button>
        <template #content>
          <a-doption>{{ t('editorToolbar.localPreview') }}</a-doption>
          <a-doption>{{ t('editorToolbar.browserPreview') }}</a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSharedLocales } from '@/locales';
import { useArticleStore } from '@/store/editor';
const { t } = useSharedLocales();

withDefaults(
  defineProps<{
    unsupportRichTextEditor?: boolean;
  }>(),
  {
    unsupportRichTextEditor: false
  }
);
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
