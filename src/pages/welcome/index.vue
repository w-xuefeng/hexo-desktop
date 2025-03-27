<template>
  <div class="welcome" @drop="drop" @dragover="dragover">
    <div class="header">
      <switch-lang />
      <switch-theme />
    </div>
    <img src="@/assets/imgs/logo.svg" alt="logo" width="100" />
    <a-typography>
      <a-typography-title>
        {{ t('welcome.title') }}
      </a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6" @click="createProject">
        <a-space class="target">
          <icon-plus />
          <span>{{ t('welcome.create') }}</span>
        </a-space>
      </a-typography-title>
      <a-typography-title :heading="6" @click="importProject">
        <a-space class="target">
          <icon-import />
          <span>{{ t('welcome.import') }}</span>
        </a-space>
      </a-typography-title>
    </a-typography>
    <div class="env-info-bar">
      <a-space v-for="item in envInfo" :key="item.type">
        <a-tag class="key">{{ item.type }}</a-tag>
        <span class="value">
          {{ item.output }}
        </span>
      </a-space>
      <icon-settings class="settings" :size="16" @click="settings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import SwitchLang from '@/components/switch-lang.vue';
import SwitchTheme from '@/components/switch-theme.vue';
import { useSharedLocales } from '@/locales';
import { IconPlus, IconImport, IconSettings } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { getCurrentWinId } from '@root/shared/render-utils/win-id';
import type { ExecuteResult } from '@root/shared/utils/types';

const { t } = useSharedLocales();
const winId = getCurrentWinId();
const env = ref<ExecuteResult[]>([]);

const envInfo = computed(() => {
  return env.value.filter((e) => !e.error);
});

const envErrorInfo = computed(() => {
  return env.value.filter((e) => e.error);
});

const checkEnv = async () => {
  window.ipcRenderer.on(IPC_CHANNEL.CHECK_ENV_FROM_OTHERS_PAGE, (_, rs) => {
    env.value = rs;
  });

  try {
    env.value = await window.ipcRenderer.invoke(IPC_CHANNEL.CHECK_ENV);
  } catch (error) {
    console.log('[checkEnv error]', error);
  }
  if (envErrorInfo.value.length) {
    settings();
  }
};

const dragover = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy';
  }
};

const drop = async (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const [directory] = Array.from(e.dataTransfer?.files || []);
  directory.path = window.webUtils.getPathForFile(directory);

  if (!directory?.path) {
    return;
  }
  try {
    const rs = await window.ipcRenderer.invoke(
      IPC_CHANNEL.IMPORT_PROJECT_BY_DROP,
      winId,
      directory.path
    );
    if (!rs?.success || !rs?.data) {
      Message.error(t(rs.message));
      return;
    }
  } catch (error) {
    console.log('[IMPORT_PROJECT error]', error);
  }
};

const createProject = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.OPEN_INDEPENDENT_WINDOW, '/create-project-panel', {
    title: t('welcome.create'),
    width: 800,
    height: 600,
    darkTheme: document.body.getAttribute('arco-theme') === 'dark',
    resizable: false,
    closable: false,
    query: {
      from: winId
    }
  });
};

const importProject = async () => {
  try {
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.IMPORT_PROJECT, winId, {
      title: t('welcome.import'),
      message: t('welcome.chooseProjectDirectory')
    });
    if (!rs?.success || !rs?.data) {
      Message.error(t(rs.message));
      return;
    }
  } catch (error) {
    console.log('[IMPORT_PROJECT error]', error);
  }
};

const settings = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.OPEN_INDEPENDENT_WINDOW, '/env-setting', {
    title: t('router.envSetting'),
    width: 600,
    height: 500,
    darkTheme: document.body.getAttribute('arco-theme') === 'dark',
    resizable: false,
    query: {
      from: winId
    }
  });
};

const init = () => {
  checkEnv();
  window.ipcRenderer.on(IPC_CHANNEL.IMPORT_PROJECT_BY_DROP_REPLY, (_, rs) => {
    if (!rs?.success || !rs?.data) {
      Message.error(t(rs.message));
      return;
    }
  });
};

init();
</script>

<style scoped lang="less">
.welcome {
  --header-height: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .header {
    position: fixed;
    top: 0;
    right: 20px;
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
  }

  .target {
    color: gray;
    cursor: pointer;
    &:hover {
      color: rgb(var(--arcoblue-6));
    }
  }

  .env-info-bar {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 2px 10px;
    gap: 20px;
    background: var(--env-info-bar-background);
    font-size: 12px;

    .key,
    .value {
      white-space: nowrap;
    }

    .settings {
      margin-inline-start: auto;
      cursor: pointer;
    }
  }
}
</style>
