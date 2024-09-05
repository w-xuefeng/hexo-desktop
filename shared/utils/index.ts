import type { DeepKeyOf } from './types';

export function omit<T extends Record<string | symbol, any>, K extends keyof T>(
  object: T,
  keys: K | K[]
): Omit<T, K> {
  const omitKey = !Array.isArray(keys) ? [keys] : keys;
  return [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)].reduce(
    (t, k) => {
      if (!omitKey.includes(k as K)) {
        // @ts-ignore
        t[k] = object[k as K];
      }
      return t;
    },
    {} as Omit<T, K>
  );
}

export function stripAnsiCodes(str?: string) {
  return (
    str?.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nq-uy=><]/g,
      ''
    ) || ''
  );
}

export function deepGet<T, K extends DeepKeyOf<T> | undefined, V>(
  obj: T,
  path?: K,
  defaultValue?: V
) {
  if (!path) {
    return obj;
  }
  const pathArray = path.split('.');
  let res: V | T | undefined = obj;
  for (let i = 0; i < pathArray.length; i++) {
    if (
      res?.[pathArray[i] as keyof (V | T)] !== void 0 &&
      res?.[pathArray[i] as keyof (V | T)] !== null
    ) {
      res = res[pathArray[i] as keyof (V | T)] as V;
    } else {
      res = defaultValue;
      break;
    }
  }
  return res;
}
