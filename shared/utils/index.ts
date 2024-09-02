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
