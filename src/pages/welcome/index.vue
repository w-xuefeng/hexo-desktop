<template>
  <div class="welcome">
    <div class="header">
      <switch-lang />
      <switch-theme />
    </div>
    <img src="@/assets/imgs/logo.svg" alt="logo" width="100" />
    <a-typography>
      <a-typography-title>
        {{ $t('welcome.title') }}
      </a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6" @click="createProject">
        <a-space class="target">
          <icon-plus />
          <span>{{ $t('welcome.create') }}</span>
        </a-space>
      </a-typography-title>
      <a-typography-title :heading="6" @click="importProject">
        <a-space class="target">
          <icon-import />
          <span>{{ $t('welcome.import') }}</span>
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
import { useRouter } from 'vue-router';
import type { ExecuteResult } from '@root/shared/utils/types';

const { t } = useSharedLocales();
const router = useRouter();
const env = ref<ExecuteResult[]>([]);

const envInfo = computed(() => {
  return env.value.filter((e) => !e.error);
});

// const envErrorInfo = computed(() => {
//   return env.value.filter((e) => e.error);
// });

const checkEnv = async () => {
  try {
    env.value = await window.ipcRenderer.invoke(IPC_CHANNEL.CHECK_ENV);
  } catch (error) {
    console.log('[checkEnv error]', error);
  }
};

const createProject = () => {
  window.ipcRenderer.invoke(IPC_CHANNEL.OPEN_CREATE_PROJECT, '/create-project-panel', {
    title: t('welcome.create'),
    width: 800,
    height: 600,
    darkTheme: document.body.getAttribute('arco-theme') === 'dark',
    resizable: false
  });
  // try {
  //   const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_PROJECT, {
  //     name: '',
  //     path: '/Users/mac/Documents/projects/tangyuan-space',
  //     themeNpmPkg: ''
  //   });
  //   if (!rs?.success || !rs?.data) {
  //     return;
  //   }
  //   router.replace({
  //     name: 'main-editor',
  //     query: {
  //       path: rs.data
  //     }
  //   });
  // } catch (error) {
  //   console.log('[IMPORT_PROJECT error]', error);
  // }
};
const importProject = async () => {
  try {
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.IMPORT_PROJECT, {
      title: t('welcome.import'),
      message: t('welcome.chooseProjectDirectory')
    });
    if (!rs?.success || !rs?.data) {
      return;
    }
    router.replace({
      name: 'main-editor',
      query: {
        path: rs.data
      }
    });
  } catch (error) {
    console.log('[IMPORT_PROJECT error]', error);
  }
};

const settings = () => {};

checkEnv();
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
      margin-left: auto;
      cursor: pointer;
    }
  }
}
</style>
