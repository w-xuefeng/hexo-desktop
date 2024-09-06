<template>
  <div class="menu-item" :class="{ 'menu-item-active': !!active }">
    <div class="menu-icon">
      <slot name="icon"></slot>
    </div>
    <span class="menu-title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  active?: boolean;
}>();
</script>

<style scoped lang="less">
.menu-item {
  width: var(--layout-menu-item-width);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 5px;
  box-sizing: border-box;
  .menu-icon {
    color: inherit;
    font-size: var(--layout-menu-item-icon-size);
    width: var(--layout-menu-item-icon-size);
    max-width: var(--layout-menu-item-icon-size);
    min-width: var(--layout-menu-item-icon-size);
    height: var(--layout-menu-item-icon-size);
    min-height: var(--layout-menu-item-icon-size);
    max-height: var(--layout-menu-item-icon-size);
  }
  .menu-title {
    font-size: 10px;
    word-break: break-word;
    word-wrap: break-word;
    text-align: center;
  }

  &-active,
  &:hover {
    color: var(--layout-menu-item-hover-color);
    background: var(--layout-menu-item-hover-background);
  }
}
</style>
