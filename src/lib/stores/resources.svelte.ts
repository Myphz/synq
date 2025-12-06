export type Resource<T> = {
  value: T | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
};

const resources = $state<Record<string, Resource<unknown>>>({});
export const EMPTY_RESOURCE = { value: null, refetch: () => {} };

export const createDynamicResource = <T>(
  key: string,
  get: () => Promise<T>,
  opts?: { replace: boolean }
) => {
  // if (opts?.replace && resources[key]) delete resources[key];
  // Replace by default
  if (resources[key]) delete resources[key];
  if (resources[key]) return resources[key] as Resource<T>;

  const refetch = async () => {
    if (resources[key].isRefetching) return;
    resources[key].isRefetching = true;

    resources[key].value = null;
    try {
      resources[key].value = await get();
    } catch {
      delete resources[key];
      return;
    }

    resources[key].isRefetching = false;
  };

  resources[key] = {
    value: null,
    refetch,
    isRefetching: false
  };

  refetch();
  return resources[key] as Resource<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDynamicResource = <T extends (...args: any[]) => unknown>(
  name: string
) => {
  const ret = resources[name] || EMPTY_RESOURCE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ret as ReturnType<T> extends Resource<any>
    ? ReturnType<T>
    : Resource<unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const waitForDynamicResource = <T extends (...args: any[]) => unknown>(
  name: string
) =>
  new Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReturnType<T> extends Resource<any> ? ReturnType<T> : Resource<unknown>
  >((res) => {
    const cleanup = $effect.root(() => {
      $effect(() => {
        const resource = resources[name] || EMPTY_RESOURCE;

        if (resource.value && !resource.isRefetching) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          res(resource as any);
          cleanup();
        }
      });
    });
  });

export const refetchDynamicResource = (name: string) =>
  getDynamicResource(name).refetch?.();

export const deleteDynamicResource = (name: string) => delete resources[name];
