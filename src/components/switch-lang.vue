<template>
  <a-dropdown trigger="click" @select="i18nCommand">
    <span class="lang-select-dropdown">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        style="width: 20px; height: 20px"
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d=" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "
          fill="currentColor"
        ></path>
      </svg>
      {{ currentSupportLanguages[currentLocale] }}
      <IconDown class="arrow-down" />
    </span>

    <template #content>
      <a-doption v-for="lang in SUPPORT_LOCALES" :key="lang.value" :value="lang.value">
        {{ lang.name }}
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import {
  setI18nLanguage,
  currentSupportLanguages,
  SUPPORT_LOCALES,
  TLanguage,
  currentLocale
} from '@/locales';
import { IconDown } from '@arco-design/web-vue/es/icon';

type TCommandType = string | number | Record<string, any> | undefined;

const i18nCommand = async (lang: TCommandType) => {
  await setI18nLanguage(lang as TLanguage);
};
</script>

<style scoped lang="less">
.lang-select-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
</style>
