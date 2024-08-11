<template>
  <div class="welcome">
    <div class="header">
      <switch-lang />
      <switch-theme />
    </div>
    <img
      src="@/assets/imgs/logo.svg"
      alt="logo"
      width="100"
    />
    <a-typography>
      <a-typography-title>
        {{ $t('welcome.title') }}
      </a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography-title
        :heading="6"
        @click="createProject"
      >
        <a-space class="target">
          <icon-plus />
          <span>{{ $t('welcome.create') }}</span>
        </a-space>
      </a-typography-title>
      <a-typography-title
        :heading="6"
        @click="importProject"
      >
        <a-space class="target">
          <icon-import />
          <span>{{ $t('welcome.import') }}</span>
        </a-space>
      </a-typography-title>
    </a-typography>
  </div>
</template>

<script setup lang="ts">
import SwitchLang from '@/components/switch-lang.vue';
import SwitchTheme from '@/components/switch-theme.vue';
import {
  IconPlus,
  IconImport
} from '@arco-design/web-vue/es/icon';

const createProject = () => {
  console.log('createProject');
};
const importProject = () => {
  console.log('importProject');
};
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
}
</style>
