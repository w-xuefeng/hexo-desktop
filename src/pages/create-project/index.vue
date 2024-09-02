<template>
  <div class="create-project-panel">
    <template v-if="projectCreating">
      <a-space direction="vertical" class="loading">
        <Loading
          :text="`${$t('welcome.creating')} ${form.name}...`"
          :description="`${$t('welcome.projectPath')}:${[form.path, sep, form.name].join('')}`"
        />
        <div>{{ progressLog.at(-1) }}</div>
      </a-space>
    </template>

    <template v-else>
      <a-row :gutter="10" align="center">
        <a-col class="label">{{ $t('welcome.projectName') }} <i class="red">*</i></a-col>
        <a-col class="item">
          <a-input v-model="form.name" :placeholder="$t('welcome.inputName')"></a-input>
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
        {{ $t('welcome.projectPath') }}: {{ form.path }}{{ sep }}{{ form.name }}
      </a-row>

      <a-row align="center">
        <a-col class="label">
          {{ $t('welcome.projectTheme') }}（{{ $t('welcome.optional') }}）
        </a-col>
        <a-col class="item">
          <a-select
            v-model="form.themeNpmPkg"
            :placeholder="$t('welcome.selectProjectTheme')"
            :loading="searchingTheme"
            allow-create
            allow-clear
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
          <a-input
            v-model="form.gitRemoteOrigin"
            :placeholder="$t('welcome.inputGitRemoteOrigin')"
          ></a-input>
        </a-col>
      </a-row>
    </template>

    <footer class="footer">
      <a-button :disabled="projectCreating" @click="cancel">{{ $t('operate.cancel') }}</a-button>
      <a-button type="primary" :disabled="disable" :loading="projectCreating" @click="confirm">
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
import { useSharedLocales } from '@/locales';
import Loading from '@/components/loading.vue';

useTheme();
const { t } = useSharedLocales();
const sep = ref('/');
const projectCreating = ref(false);

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

const progressLog = ref<string[]>([]);

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
    Message.warning(t('waringTips.inputProjectName'));
    return;
  }
  if (!form.path) {
    Message.warning(t('waringTips.inputProjectPath'));
    return;
  }
  try {
    projectCreating.value = true;
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_PROJECT, toRaw(form));
    if (!rs?.success || !rs?.data) {
      Message.error(t(rs.message));
      return;
    }
  } catch (error) {
    console.log('[CREATE_PROJECT error]', error);
  } finally {
    projectCreating.value = false;
  }
};

window.ipcRenderer.on(IPC_CHANNEL.CREATE_PROJECT_PROGRESS, (_, data: string) => {
  progressLog.value.push(data);
});
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

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }

  .red {
    color: #f40;
  }

  .label {
    margin-block-end: 10px;
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
    margin-block-start: auto;
  }
}
</style>
