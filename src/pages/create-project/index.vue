<template>
  <switch-theme hidden />
  <div class="create-project-panel">
    <a-row :gutter="10" align="center">
      <a-col class="label" :span="4">项目名称</a-col>
      <a-col class="item" :span="20">
        <a-input v-model="form.name"></a-input>
      </a-col>
    </a-row>
    <a-row :gutter="10" align="center">
      <a-col class="label" :span="4">项目路径</a-col>
      <a-col class="item pointer" :span="20" @click="chooseDirectoryPath">
        <a-input v-model="form.path" readonly :placeholder="$t('welcome.chooseProjectDirectory')">
          <template #append>
            <a-tag>···</a-tag>
          </template>
        </a-input>
      </a-col>
    </a-row>

    <a-row :gutter="10" align="center">
      <a-col class="label" :span="8">项目主题（可选）</a-col>
      <a-col class="item" :span="16">
        <a-select
          v-model="form.themeNpmPkg"
          placeholder="Please select ..."
          :loading="searchingTheme"
          @popup-visible-change="onSelectTheme"
        >
          <a-option v-for="theme in themeList" :key="theme.name">{{ theme.name }}</a-option>
        </a-select>
      </a-col>
    </a-row>

    <a-row :gutter="10" align="center">
      <a-col class="label" :span="8">远程仓库地址（可选）</a-col>
      <a-col class="item" :span="16">
        <a-input v-model="form.gitRemoteOrigin"></a-input>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ICreateProjectOptions } from '@root/shared/utils/types';
import { reactive } from 'vue';
import { npmKeyword } from 'npm-keyword';
import SwitchTheme from '@/components/switch-theme.vue';

const form = reactive<ICreateProjectOptions>({
  name: '',
  path: '',
  themeNpmPkg: 'default',
  gitRemoteOrigin: ''
});

const searchingTheme = ref(false);
const themeList = ref<
  {
    name: string;
    description: string;
  }[]
>([]);

const searchTheme = async () => {
  searchingTheme.value = true;
  try {
    const rs = await npmKeyword('hexo-theme');
    themeList.value = [
      {
        name: 'default',
        description: 'default theme'
      },
      ...rs.filter((e) => e.name.startsWith('hexo-theme-'))
    ];
  } catch (error) {
    console.log('[searchTheme error]', error);
  } finally {
    searchingTheme.value = false;
  }
};

const onSelectTheme = (visible: boolean) => {
  if (!visible) {
    return;
  }
  if (themeList.value.length !== 0) {
    return;
  }
  searchTheme();
};

const chooseDirectoryPath = () => {
  console.log('chooseDirectoryPath');
};
</script>

<style scoped lang="less">
.create-project-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;

  .pointer {
    cursor: pointer;
  }
}
</style>
