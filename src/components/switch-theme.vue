<template>
  <img v-if="mini" class="theme-icon" :src="icon()" alt="icon" @click="changeTheme" />
  <a-select v-else v-model="theme">
    <a-option value="light"> {{ t('theme.light') }} </a-option>
    <a-option value="dark"> {{ t('theme.dark') }} </a-option>
    <a-option value="auto"> {{ t('theme.auto') }} </a-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme, GLThemeRef, type ThemeObject } from '@/store/theme';
import IconSun from '@/assets/imgs/sun.svg';
import IconMoon from '@/assets/imgs/moon.svg';
import IconSystemDark from '@/assets/imgs/system-dark.svg';
import IconSystemLight from '@/assets/imgs/system-light.svg';
import { useSharedLocales } from '@/locales';

const { t } = useSharedLocales();

withDefaults(defineProps<{ mini?: boolean }>(), {
  mini: false
});

const internalTheme = ref<keyof Omit<ThemeObject, 'auto'>>();
const { theme } = useTheme((_, value) => {
  internalTheme.value = value;
}).watch();

const icon = () => {
  switch (theme.value) {
    case 'light':
      return IconSun;
    case 'dark':
      return IconMoon;
    case 'auto':
      return internalTheme.value === 'light' ? IconSystemLight : IconSystemDark;
    default:
      return IconSystemLight;
  }
};

const changeTheme = () => {
  if (theme.value === 'light') {
    theme.value = 'dark';
    return;
  }
  if (theme.value === 'dark') {
    theme.value = 'auto';
    return;
  }
  if (theme.value === 'auto') {
    theme.value = 'light';
    return;
  }
};

const init = () => {
  internalTheme.value =
    theme.value === 'auto' ? (GLThemeRef.matchMedia.matches ? 'light' : 'dark') : theme.value;
};

init();
</script>

<style scoped lang="less">
.theme-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
