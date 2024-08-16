<template>
  <div class="create-project-panel">
    <a-row :gutter="10" align="center">
      <a-col class="label">{{ $t('welcome.projectName') }} <i class="red">*</i></a-col>
      <a-col class="item">
        <a-input v-model="form.name"></a-input>
      </a-col>
    </a-row>
    <a-row :gutter="10" align="center">
      <a-col class="label">{{ $t('welcome.projectLocation') }} <i class="red">*</i></a-col>
      <a-col class="item pointer">
        <a-input
          v-model="form.path"
          class="path"
          readonly
          :placeholder="$t('welcome.chooseProjectDirectory')"
        >
          <template #append>
            <div class="choose-directory" @click="chooseDirectoryPath">···</div>
          </template>
        </a-input>
      </a-col>
    </a-row>

    <a-row v-if="form.path && form.name" class="tip">
      项目路径 {{ form.path }}{{ sep }}{{ form.name }}
    </a-row>

    <a-row align="center">
      <a-col class="label">
        {{ $t('welcome.projectTheme') }}（{{ $t('welcome.optional') }}）
      </a-col>
      <a-col class="item">
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

    <a-row align="center">
      <a-col class="label">
        {{ $t('welcome.gitRemoteOrigin') }}（{{ $t('welcome.optional') }}）
      </a-col>
      <a-col class="item">
        <a-input v-model="form.gitRemoteOrigin"></a-input>
      </a-col>
    </a-row>

    <footer class="footer">
      <a-button @click="cancel">{{ $t('operate.cancel') }}</a-button>
      <a-button type="primary" :disabled="disable" @click="confirm">
        {{ $t('operate.confirm') }}
      </a-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, computed } from 'vue';
import { ICreateProjectOptions } from '@root/shared/utils/types';
import { reactive } from 'vue';
import { npmKeyword } from 'npm-keyword';
import { useTheme } from '@/store';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import { Message } from '@arco-design/web-vue';

useTheme();
const sep = ref('/');

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

const disable = computed(() => {
  return !form.name || !form.path;
});

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

const chooseDirectoryPath = async () => {
  const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CHOOSE_DIRECTORY);
  if (rs.canceled) {
    return;
  }
  const [projectPath] = rs.filePaths;
  if (!projectPath) {
    return;
  }
  sep.value = rs.sep;
  form.path = projectPath;
};

const cancel = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
};

const confirm = async () => {
  if (!form.name) {
    Message.warning('请填写项目名称');
    return;
  }
  if (!form.path) {
    Message.warning('请填写项目路径');
    return;
  }
  try {
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_PROJECT, toRaw(form));
    if (!rs?.success || !rs?.data) {
      Message.error(rs.message);
      return;
    }
  } catch (error) {
    console.log('[CREATE_PROJECT error]', error);
  }
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
  height: 100%;

  .red {
    color: #f40;
  }

  .label {
    margin-bottom: 10px;
  }

  .choose-directory {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0 12px;
  }

  .path {
    :deep(.arco-input-append) {
      padding: 0;
    }
  }

  .pointer {
    cursor: pointer;
  }

  .tip {
    font-size: 12px;
    color: gray;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: auto;
  }
}
</style>
