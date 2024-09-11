<template>
  <div class="env-setting-panel">
    <a-space direction="vertical">
      <a-row :gutter="10" align="center">
        <a-col class="label">{{ t('envSetting.envPath') }} <i class="red">*</i></a-col>
        <a-col class="item pointer">
          <a-textarea
            v-model="form.envPath"
            class="path"
            :disabled="loading"
            :placeholder="t('envSetting.inputEnvPath')"
            :auto-size="{ minRows: 10, maxRows: 15 }"
          >
          </a-textarea>
        </a-col>
      </a-row>
    </a-space>

    <footer class="footer">
      <a-button @click="cancel">{{ t('operate.cancel') }}</a-button>
      <a-button type="outline" @click="getEnvPath">{{ t('envSetting.autoGetEnvPath') }}</a-button>
      <a-button type="outline" :disabled="disable" :loading="loading" @click="check()">
        {{ t('envSetting.checkPath') }}
      </a-button>
      <a-button type="primary" :disabled="disable" :loading="loading" @click="confirm">
        {{ t('operate.save') }}
      </a-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/store/theme';
import { IPC_CHANNEL, STORE_KEY } from '@root/shared/dicts/enums';
import { Message } from '@arco-design/web-vue';
import { SharedStore } from '@root/shared/render-utils/storage';
import { useSharedLocales } from '@/locales';
import type { ExecuteResult } from '@root/shared/utils/types';

useTheme().watch();
const loading = ref(false);
const route = useRoute();

const { t } = useSharedLocales();

const env = ref<ExecuteResult[]>([]);

const replyToWinId = ref(route.query.from);

const form = reactive({
  envPath: SharedStore.getSync(STORE_KEY.ENV_PATH) || ''
});

const disable = computed(() => {
  return !form.envPath;
});

const cancel = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
};

const getEnvPath = async () => {
  const { success, path, sep } = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_ENV_PATH);
  if (!success || !path || !sep) {
    return;
  }
  form.envPath = path;
};

const check = async (toast = true) => {
  if (!form.envPath) {
    Message.warning(t('envSetting.inputEnvPath'));
    return false;
  }
  env.value = await window.ipcRenderer.invoke(IPC_CHANNEL.CHECK_ENV, form.envPath);
  const errorItem = env.value.find((e) => !!e.error);
  if (errorItem) {
    if (errorItem.error && toast) {
      Message.error({ content: errorItem.error });
    }
    return false;
  }
  if (toast) {
    Message.success({ content: t('envSetting.checkPathPass') });
  }
  return true;
};

const confirm = async () => {
  if (!form.envPath) {
    Message.warning(t('envSetting.inputEnvPath'));
    return;
  }
  loading.value = true;
  try {
    const rs = await check();
    if (!rs) {
      return;
    }
    SharedStore.set(STORE_KEY.ENV_PATH, form.envPath);
    window.ipcRenderer.send(IPC_CHANNEL.CHECK_ENV, replyToWinId.value);
    window.ipcRenderer.invoke(IPC_CHANNEL.CLOSE_WINDOW);
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
