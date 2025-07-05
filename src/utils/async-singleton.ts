const singletons: Record<string, { value: unknown; isFetching: boolean }> = {};

export const toAsyncSingleton = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...params: any[]) => Promise<T>,
  id?: string
) => {
  const singletonId = id || Date.now().toString();

  return async () => {
    if (!singletons[singletonId])
      singletons[singletonId] = { value: null, isFetching: false };

    while (singletons[singletonId].isFetching)
      await new Promise((res) => setTimeout(res, 100));

    if (singletons[singletonId].value)
      return singletons[singletonId].value as T;

    singletons[singletonId].isFetching = true;
    singletons[singletonId].value = await fn();
    singletons[singletonId].isFetching = false;

    return singletons[singletonId].value as T;
  };
};

export const resetSingleton = (id: string) => delete singletons[id];
