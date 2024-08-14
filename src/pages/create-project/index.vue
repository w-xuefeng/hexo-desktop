<template>
  <div class="create-project-panel">
    <a-row :gutter="10">
      <a-col class="label" :span="4">项目名称</a-col>
      <a-col class="item" :span="20">
        <a-input v-model="form.name"></a-input>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col class="label" :span="4">项目路径</a-col>
      <a-col class="item" :span="20">
        <a-space>
          <div v-if="form.path" class="path">{{ form.path }}</div>
          <a-tag>...</a-tag>
        </a-space>
      </a-col>
    </a-row>

    <a-row :gutter="10">
      <a-col class="label" :span="4">项目主题</a-col>
      <a-col class="item" :span="20">
        <a-select v-model="form.themeNpmPkg" placeholder="Please select ...">
          <a-option>Beijing</a-option>
          <a-option>Shanghai</a-option>
          <a-option>Guangzhou</a-option>
        </a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ICreateProjectOptions } from '@root/shared/utils/types';
import { reactive } from 'vue';
const form = reactive<ICreateProjectOptions>({
  name: '',
  path: '',
  themeNpmPkg: ''
});
</script>

<style scoped lang="less">
.create-project-panel {
  display: flex;
  flex-direction: column;
}
</style>
