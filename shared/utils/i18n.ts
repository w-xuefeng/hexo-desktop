import zhCN from '../langs/zh-cn';
import enUS from '../langs/en-us';
import type { DeepKeyOf } from './types';
import { deepGet } from '.';

export const messages = {
  'zh-cn': zhCN,
  'en-us': enUS
};

export type Langs = keyof typeof messages;

export type ExtraMessage<T> = {
  [k in Langs]: T;
};

export function i18n<EM>(lang: Langs, extraMsg?: ExtraMessage<EM>) {
  return {
    lang,
    t: function (
      path: DeepKeyOf<typeof zhCN> | DeepKeyOf<typeof enUS> | DeepKeyOf<EM>,
      replacer?: Record<string, any>
    ) {
      const obj = Object.assign(
        {},
        {
          'zh-cn': Object.assign(messages['zh-cn'], extraMsg?.['zh-cn']),
          'en-us': Object.assign(messages['en-us'], extraMsg?.['en-us'])
        }
      )[lang];
      let value = deepGet(obj, path as DeepKeyOf<typeof obj>, path) as string;
      if (replacer && value) {
        Object.keys(replacer).forEach((k) => {
          if (value.includes(`{${k}}`)) {
            value = value.replace(`{${k}}`, replacer[k]);
          }
        });
      }
      return value;
    }
  };
}
