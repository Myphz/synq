import { withMutex_anonymous } from "./mutex";

const singletons: Record<string, unknown> = {};

export const toAsyncSingleton = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...params: any[]) => Promise<T>,
  id?: string
) => {
  const singletonId = id || Date.now().toString();

  return async () =>
    await withMutex_anonymous(async () => {
      if (singletons[singletonId]) return singletons[singletonId] as T;

      try {
        singletons[singletonId] = await fn();
      } catch (err) {
        delete singletons[singletonId];
        throw err;
      }

      return singletons[singletonId] as T;
    }, singletonId);
};

export const resetSingleton = (id: string) => delete singletons[id];
export const getSingleton = (id: string) => singletons[id];
