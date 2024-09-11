import { createI18n } from 'vue-i18n';
import { computed } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter';

import ArcoEnUS from '@arco-design/web-vue/es/locale/lang/en-us';
import ArcoZhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import type { ArcoLang } from '@arco-design/web-vue/es/locale/interface';

import enUs from '@root/shared/langs/en-us';
import zhCn from '@root/shared/langs/zh-cn';
import { SharedStore } from '@root/shared/render-utils/storage';
import { STORE_KEY } from '@root/shared/dicts/enums';

import { i18nChangeLanguage } from '@wangeditor/editor';

if (!('dayjs' in globalThis)) {
  // @ts-ignore
  dayjs.extend(customParseFormat);
  // @ts-ignore
  dayjs.extend(isSameOrBefore);
  // @ts-ignore
  dayjs.extend(isSameOrAfter);
  Reflect.defineProperty(globalThis, 'dayjs', {
    value: dayjs
  });
}

// @ts-ignore
import('@root/shared/langs/dayjs/zh-cn.js');
// @ts-ignore
import('@root/shared/langs/dayjs/en.js');

export const supportLanguages = {
  'zh-cn': '中文 (简体中文)',
  'en-us': 'English (US)'
};

export type TLanguage = keyof typeof supportLanguages;

export const getSupportLanguages = () => {
  return supportLanguages;
};

export const currentSupportLanguages = getSupportLanguages();
export const SUPPORT_LOCALES_LIST = Object.keys(currentSupportLanguages);
export const SUPPORT_LOCALES = Object.keys(currentSupportLanguages).map((k) => ({
  name: currentSupportLanguages[k as keyof typeof currentSupportLanguages],
  value: k
}));

export const messages = {
  'zh-cn': zhCn,
  'en-us': enUs
};

export const arcoLangs: Partial<Record<TLanguage, ArcoLang>> = {
  'zh-cn': ArcoZhCN,
  'en-us': ArcoEnUS
};

export const dayjsLangs: Record<TLanguage, string> = {
  'zh-cn': 'dayjs_locale_zh_cn',
  'en-us': 'dayjs_locale_en'
};

export const wangEditorLangs: Record<TLanguage, string> = {
  'en-us': 'en',
  'zh-cn': 'zh-CN'
};

let langChangeFromStore = false;

export async function loadDayJsLocals(locale: TLanguage) {
  try {
    dayjs.locale(dayjsLangs[locale]);
  } catch (error) {
    console.log(`[LoadDayJsLocals ${locale} Error]`, error);
  }
}

const initialLanguage = (SharedStore.getSync(STORE_KEY.LANG) || 'zh-cn') as TLanguage;

loadDayJsLocals(initialLanguage);
export const sharedI18n = createI18n({
  legacy: false,
  locale: initialLanguage,
  fallbackLocale: 'zh-cn',
  warnHtmlInMessage: 'off',
  warnHtmlMessage: false,
  messages
});

export async function setI18nLanguage(locale: TLanguage) {
  loadDayJsLocals(locale);
  sharedI18n.global.locale.value = locale;
  i18nChangeLanguage(wangEditorLangs[locale]);
  document.querySelector('html')!.setAttribute('lang', locale.substring(0, 2));
  if (langChangeFromStore) {
    langChangeFromStore = false;
  } else {
    SharedStore.set(STORE_KEY.LANG, locale);
  }
}

export const currentLocale = computed(() => sharedI18n.global.locale.value);

export function useSharedLocales() {
  return sharedI18n.global;
}

export default sharedI18n;
