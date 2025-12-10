import { Mutex } from "async-mutex";

const locks = new Map<string, Mutex>();

export const toAtomic = <T, K extends unknown[]>(
  fn: (...args: K) => T
): ((...args: K) => Promise<Awaited<T>>) => {
  const mutex = new Mutex();

  return async (...args: K): Promise<Awaited<T>> => {
    return await mutex.runExclusive(() => fn(...args));
  };
};

export const atomic = async <T>(
  fn: () => T,
  key: string
): Promise<Awaited<T>> => {
  if (!locks.has(key)) locks.set(key, new Mutex());

  // runExclusive() automatically acquires the lock, executes the fn,
  // and releases it (even if the fn throws an error)
  return await locks.get(key)!.runExclusive(fn);
};
