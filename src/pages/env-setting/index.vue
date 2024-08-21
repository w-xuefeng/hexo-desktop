<template>
  <div class="env-setting-panel">
    <a-space direction="vertical">
      <a-row :gutter="10" align="center">
        <a-col class="label">{{ $t('envSetting.nodePath') }} <i class="red">*</i></a-col>
        <a-col class="item pointer">
          <a-input
            v-model="form.nodePath"
            class="path"
            :disabled="loading"
            :placeholder="$t('envSetting.chooseOrInputNodePath')"
          >
            <template #append>
              <div class="choose-directory" @click="chooseDirectoryPath('nodePath')">···</div>
            </template>
          </a-input>
        </a-col>
      </a-row>
      <a-space v-if="versions.node" class="version-tips">
        <span>{{ $t('envSetting.nodeVersion') }}:</span>
        <a-tag color="green">{{ versions.node }}</a-tag>
      </a-space>
      <a-space v-if="errorInfo.node" class="version-tips">
        <span>{{ $t('envSetting.errorTip') }}:</span>
        <span class="red">{{ errorInfo.node }}</span>
      </a-space>
    </a-space>

    <a-space direction="vertical">
      <a-row :gutter="10" align="center">
        <a-col class="label">{{ $t('envSetting.npmPath') }} <i class="red">*</i></a-col>
        <a-col class="item pointer">
          <a-input
            v-model="form.npmPath"
            class="path"
            :disabled="loading"
            :placeholder="$t('envSetting.chooseOrInputNpmPath')"
          >
            <template #append>
              <div class="choose-directory" @click="chooseDirectoryPath('npmPath')">···</div>
            </template>
          </a-input>
        </a-col>
      </a-row>
      <a-space v-if="versions.npm" class="version-tips">
        <span>{{ $t('envSetting.npmVersion') }}:</span>
        <a-tag color="green">{{ versions.npm }}</a-tag>
      </a-space>
      <a-space v-if="errorInfo.npm" class="version-tips">
        <span>{{ $t('envSetting.errorTip') }}:</span>
        <span class="red">{{ errorInfo.npm }}</span>
      </a-space>
    </a-space>

    <a-space direction="vertical">
      <a-row :gutter="10" align="center">
        <a-col class="label">{{ $t('envSetting.hexoPath') }} <i class="red">*</i></a-col>
        <a-col class="item pointer">
          <a-input
            v-model="form.hexoPath"
            class="path"
            :disabled="loading"
            :placeholder="$t('envSetting.chooseOrInputHexoPath')"
          >
            <template #append>
              <div class="choose-directory" @click="chooseDirectoryPath('hexoPath')">···</div>
            </template>
          </a-input>
        </a-col>
      </a-row>
      <a-space v-if="versions.hexo" class="version-tips">
        <span>{{ $t('envSetting.hexoVersion') }}:</span>
        <a-tag color="green">{{ versions.hexo }}</a-tag>
      </a-space>
      <a-space v-if="errorInfo.hexo" class="version-tips">
        <span>{{ $t('envSetting.errorTip') }}:</span>
        <span class="red">{{ errorInfo.hexo }}</span>
      </a-space>
    </a-space>

    <footer class="footer">
      <a-button @click="cancel">{{ $t('operate.cancel') }}</a-button>
      <a-button type="outline" @click="getEnvPath">{{ $t('envSetting.autoGetEnvPath') }}</a-button>
      <a-button type="outline" :disabled="disable" :loading="loading" @click="checkAllPath">
        {{ $t('envSetting.checkPath') }}
      </a-button>
      <a-button type="primary" :disabled="disable" :loading="loading" @click="confirm">
        {{ $t('operate.save') }}
      </a-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useTheme } from '@/store';
import { IPC_CHANNEL, STORE_KEY } from '@root/shared/dicts/enums';
import { Message } from '@arco-design/web-vue';
import { SharedStore } from '@root/shared/render-utils/storage';
import { useSharedLocales } from '@/locales';

const keyMap = {
  node: 'NODE_PATH',
  npm: 'NPM_PATH',
  hexo: 'HEXO_PATH'
} as const;

interface ICheckResult {
  status: boolean;
  version: string | null;
  error: string | Error | null;
  stderr: string | null;
  exist: boolean;
  isFile: boolean;
  isDirectory: boolean;
}

useTheme();
const loading = ref(false);

const versions = reactive({
  node: null as string | null,
  npm: null as string | null,
  hexo: null as string | null
});

const errorInfo = reactive({
  node: null as string | Error | null,
  npm: null as string | Error | null,
  hexo: null as string | Error | null
});

const { t } = useSharedLocales();

const form = reactive({
  nodePath: SharedStore.getSync(STORE_KEY.NODE_PATH) || '',
  npmPath: SharedStore.getSync(STORE_KEY.NPM_PATH) || '',
  hexoPath: SharedStore.getSync(STORE_KEY.HEXO_PATH) || ''
});

const disable = computed(() => {
  return !form.nodePath || !form.npmPath || !form.hexoPath;
});

const chooseDirectoryPath = async (type: 'nodePath' | 'npmPath' | 'hexoPath') => {
  const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CHOOSE_FILE);
  if (rs.canceled) {
    return;
  }
  const [commandPath] = rs.filePaths;
  if (!commandPath) {
    return;
  }
  form[type] = commandPath;
};

const cancel = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
};

const getEnvPath = async () => {
  const { path, sep } = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_ENV_PATH);
  if (!path || !sep) {
    return;
  }
  const paths = path.split(sep);
  console.log('GET_ENV_PATH', paths);
};

const handleCheckResult = (
  type: 'node' | 'npm' | 'hexo',
  rs: ICheckResult,
  onSuccess?: (type: 'node' | 'npm' | 'hexo', rs: ICheckResult) => void,
  onError?: (type: 'node' | 'npm' | 'hexo', rs: ICheckResult) => void
) => {
  if (rs.status) {
    errorInfo[type] = null;
    versions[type] = type === 'hexo' ? rs.version?.split('\n')?.at(0) || null : rs.version;
    onSuccess?.(type, rs);
    return;
  }

  if (!rs.version && rs.stderr) {
    versions[type] = null;
    errorInfo[type] = rs.stderr;
  } else if (rs.error) {
    versions[type] = null;
    errorInfo[type] = rs.error;
  } else if (!rs.exist) {
    versions[type] = null;
    errorInfo[type] = t('exception.fileNotExist');
  } else if (!rs.isFile) {
    versions[type] = null;
    errorInfo[type] = t('exception.pathIsNotFile');
  }
  onError?.(type, rs);
};

const check = (commandPath: string, type: 'node' | 'npm' | 'hexo') => {
  return new Promise<string>((resolve, reject) => {
    const checkFileName = type;
    window.ipcRenderer
      .invoke(IPC_CHANNEL.CHECK_COMMAND_PATH, commandPath, checkFileName)
      .then((rs) => {
        handleCheckResult(
          type,
          rs,
          () => {
            type === 'node' && SharedStore.set(STORE_KEY[keyMap[type]], commandPath);
            resolve(commandPath);
          },
          reject
        );
      });
  });
};

const checkAllPath = async () => {
  loading.value = true;
  try {
    await check(form.nodePath, 'node');
    await Promise.all([check(form.npmPath, 'npm'), check(form.hexoPath, 'hexo')]);
  } finally {
    loading.value = false;
  }
};

const checkAndHandleResult = async (commandPath: string, type: 'node' | 'npm' | 'hexo') => {
  const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CHECK_COMMAND_PATH, commandPath, type);
  handleCheckResult(type, rs, () => {
    SharedStore.set(STORE_KEY[keyMap[type]], commandPath);
  });
};

const confirm = async () => {
  if (!form.nodePath) {
    Message.warning(t('envSetting.chooseOrInputNodePath'));
    return;
  }
  if (!form.npmPath) {
    Message.warning(t('envSetting.chooseOrInputNpmPath'));
    return;
  }
  if (!form.hexoPath) {
    Message.warning(t('envSetting.chooseOrInputHexoPath'));
    return;
  }
  loading.value = true;
  try {
    await Promise.all([
      checkAndHandleResult(form.nodePath, 'node'),
      checkAndHandleResult(form.npmPath, 'npm'),
      checkAndHandleResult(form.hexoPath, 'hexo')
    ]);
    window.ipcRenderer.send(IPC_CHANNEL.CHECK_ENV);
    if (versions.node && versions.npm && versions.hexo) {
      window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.env-setting-panel {
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

  .version-tips {
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
