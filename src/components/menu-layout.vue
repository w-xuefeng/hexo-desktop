<template>
  <a-layout-sider class="layout-menu">
    <MenuItem
      v-for="menu in menus"
      :key="menu.name"
      :title="getMenuTitle(menu)"
      :active="route.name === menu.name"
      @click="changeMenu(menu)"
    >
      <template #icon>
        <component :is="menu.meta.icon"></component>
      </template>
    </MenuItem>

    <div class="menu-end">
      <switch-lang mini :size="30" />
      <switch-theme mini />
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import MenuItem from './menu-item.vue';
import SwitchLang from '@/components/switch-lang.vue';
import SwitchTheme from '@/components/switch-theme.vue';
import { useRouter, useRoute } from 'vue-router';
import { menus } from '@/routers/menus';
import { getMenuTitle } from '@/routers';

const router = useRouter();
const route = useRoute();

const changeMenu = (menu: { path: string }) => {
  router.push(menu.path);
};
</script>

<style scoped lang="less">
.layout-menu {
  height: 100%;
  width: var(--layout-menu-sider-width) !important;
  margin-inline-end: var(--layout-menu-sider-margin-inline-end);
  box-sizing: border-box;
  padding: 20px 0;
  :deep(.arco-layout-sider-children) {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .menu-end {
    margin-block-start: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }
}
</style>
