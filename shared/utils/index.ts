export function omit<T extends Record<string | symbol, any>, K extends keyof T>(
  object: T,
  keys: K | K[]
): Omit<T, K> {
  const omitKey = !Array.isArray(keys) ? [keys] : keys;
  return [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)].reduce(
    (t, k) => {
      if (!omitKey.includes(k as K)) {
        t[k] = object[k as K];
      }
      return t;
    },
    {} as Omit<T, K>
  );
}
