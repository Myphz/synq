const singletons: Record<string, { value: unknown; isFetching: boolean }> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toAsyncSingleton = <T>(fn: (...params: any[]) => Promise<T>) => {
  const singletonId = Date.now().toString();
  singletons[singletonId] = { value: null, isFetching: false };

  return async () => {
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
