<template>
  <img v-if="mini" class="theme-icon" :src="icon()" alt="icon" @click="changeTheme" />
  <a-select v-else v-model="theme">
    <a-option value="light"> {{ $t('theme.light') }} </a-option>
    <a-option value="dark"> {{ $t('theme.dark') }} </a-option>
    <a-option value="auto"> {{ $t('theme.auto') }} </a-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme, type ThemeType } from '@/store/theme';
import IconSun from '@/assets/imgs/sun.svg';
import IconMoon from '@/assets/imgs/moon.svg';
import IconSystemDark from '@/assets/imgs/system-dark.svg';
import IconSystemLight from '@/assets/imgs/system-light.svg';

withDefaults(defineProps<{ mini?: boolean }>(), {
  hidden: false,
  mini: false
});

const internalTheme = ref<ThemeType>();
const { theme } = useTheme((_, value) => {
  internalTheme.value = value;
}).watch();

internalTheme.value = theme.value;

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
</script>

<style scoped lang="less">
.theme-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
