<template>
  <a-form ref="formRef" :rules="rules" :model="form" :style="{ width: '100%' }">
    <a-form-item
      field="title"
      :label="t('editor.articleTitle')"
      :validate-trigger="['change', 'blur', 'input']"
    >
      <a-input v-model="form.title" :placeholder="t('placeholders.inputArticleTitle')" />
    </a-form-item>
    <a-form-item
      field="slug"
      :label="t('editor.articleSlug')"
      :validate-trigger="['change', 'blur', 'input']"
    >
      <a-input v-model="form.slug" :placeholder="t('placeholders.inputArticleSlug')" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useSharedLocales } from '@/locales';
import { reactive, useTemplateRef, toRaw } from 'vue';

const formRef = useTemplateRef('formRef');
const { t } = useSharedLocales();

const form = reactive({
  title: '',
  slug: ''
});

const rules: any = {
  title: [
    {
      required: true,
      message: t('formValidatorMessages.articleSlugRequired')
    }
  ],
  slug: [
    {
      required: true,
      message: t('formValidatorMessages.articleSlugRequired')
    }
  ]
};

const validate = async () => {
  if (!formRef.value) {
    return;
  }
  const rs = await formRef.value.validate();
  if (rs) {
    return;
  }
  return toRaw(form);
};

defineExpose({ validate, form });
</script>

<style scoped lang="less"></style>
