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
      <a-dropdown trigger="hover" @select="onPreview">
        <a-button>
          {{ t('editorToolbar.preview') }}
          <template #icon>
            <icon-eye />
          </template>
        </a-button>
        <template #content>
          <a-doption value="local">{{ t('editorToolbar.localPreview') }}</a-doption>
          <a-doption value="browser">{{ t('editorToolbar.browserPreview') }}</a-doption>
          <a-doption value="panel">{{ t('editorToolbar.panelPreview') }}</a-doption>
        </template>
      </a-dropdown>
      <a-button @click="save">
        {{ t('operate.save') }}
        <template #icon>
          <icon-save />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSave, IconEye } from '@arco-design/web-vue/es/icon';
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

const save = () => {};

const onPreview = (command: string | number | Record<string, any> | undefined) => {
  store.preview(command as 'local' | 'browser' | 'panel');
};
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
    gap: 10px;
  }
}
</style>
