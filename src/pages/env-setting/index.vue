<template>
  <div class="env-setting-panel">
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
            <div class="choose-directory" @click="chooseDirectoryPath">···</div>
          </template>
        </a-input>
      </a-col>
    </a-row>

    <a-space v-if="version" class="version-tips">
      <span>{{ $t('envSetting.nodeVersion') }}:</span>
      <a-tag color="green">{{ version }}</a-tag>
    </a-space>

    <a-space v-if="errorInfo" class="version-tips">
      <span>{{ $t('envSetting.errorTip') }}:</span>
      <span class="red">{{ errorInfo }}</span>
    </a-space>

    <footer class="footer">
      <a-button @click="cancel">{{ $t('operate.cancel') }}</a-button>
      <a-button type="outline" :disabled="disable" :loading="loading" @click="check">
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

interface ICheckResult {
  status: boolean;
  version: string | null;
  error: Error | null;
  exist: boolean;
  isFile: boolean;
  isDirectory: boolean;
}

useTheme();
const loading = ref(false);
const version = ref<string | null>(null);
const errorInfo = ref<string | Error | null>(null);
const { t } = useSharedLocales();

const form = reactive({
  nodePath: SharedStore.getSync(STORE_KEY.NODE_PATH) || ''
});

const disable = computed(() => {
  return !form.nodePath;
});

const chooseDirectoryPath = async () => {
  const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CHOOSE_FILE);
  if (rs.canceled) {
    return;
  }
  const [nodePath] = rs.filePaths;
  if (!nodePath) {
    return;
  }
  form.nodePath = nodePath;
};

const cancel = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
};

const handleCheckResult = (rs: ICheckResult, onSuccess?: (rs: ICheckResult) => void) => {
  if (rs.status) {
    errorInfo.value = null;
    version.value = rs.version;
    onSuccess?.(rs);
  } else if (rs.error) {
    version.value = null;
    errorInfo.value = rs.error;
  } else if (!rs.exist) {
    version.value = null;
    errorInfo.value = t('exception.fileNotExist');
  } else if (!rs.isFile) {
    version.value = null;
    errorInfo.value = t('exception.pathIsNotFile');
  }
};

const check = async () => {
  loading.value = true;
  try {
    const rs = await window.ipcRenderer.invoke(
      IPC_CHANNEL.CHECK_COMMAND_PATH,
      form.nodePath,
      'node'
    );
    handleCheckResult(rs);
  } finally {
    loading.value = false;
  }
};

const confirm = async () => {
  if (!form.nodePath) {
    Message.warning('请填写项目名称');
    return;
  }
  loading.value = true;
  try {
    const rs = await window.ipcRenderer.invoke(
      IPC_CHANNEL.CHECK_COMMAND_PATH,
      form.nodePath,
      'node'
    );
    handleCheckResult(rs, () => {
      SharedStore.set(STORE_KEY.NODE_PATH, form.nodePath);
      window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
    });
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
