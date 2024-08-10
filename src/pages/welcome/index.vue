<template>
  <section class="lang-select">
    <a-dropdown
      trigger="click"
      @select="i18nCommand"
    >
      <span class="lang-select-dropdown">
        <img
          :src="i18nIconSrc"
          alt="i18n-icon"
          style="width: 20px; height: 20px"
        >
        {{ currentSupportLanguages[currentLocale] }}
        <IconDown class="arrow-down" />
      </span>

      <template #content>
        <a-doption
          v-for="lang in SUPPORT_LOCALES"
          :key="lang.value"
          :value="lang.value"
        >
          {{ lang.name }}
        </a-doption>
      </template>
    </a-dropdown>
  </section>
</template>

<script setup lang="ts">
import { setI18nLanguage, currentSupportLanguages, SUPPORT_LOCALES, TLanguage, currentLocale } from '@/locales';
import { IconDown } from '@arco-design/web-vue/es/icon';
import i18nIconSrc from '@/assets/icons/i18n.svg';

type TCommandType = string | number | Record<string, any> | undefined;

const i18nCommand = async (lang: TCommandType) => {
  await setI18nLanguage(lang as TLanguage);
};
</script>

<style scoped lang="less">
.lang-select {
  .lang-select-dropdown {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
}
</style>
