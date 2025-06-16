// Helper function to debounce the execution of an async function
// This function wraps an async function and returns an async function with
// the same signature, but it only gets called if the function stops
// being called for `delay` ms.
export const debounceAsync = <T, K>(
  fn: (args: K) => Promise<T>,
  delay: number
): ((args: K) => Promise<T>) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (args: K) =>
    new Promise((resolve, reject) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
};

export const debounceWithStartStop = <T>(
  callback: (active: boolean, value?: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let active = false;

  return (value?: T) => {
    if (!active) {
      active = true;
      callback(true, value);
    }

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      active = false;
      callback(false, value);
    }, delay);
  };
};
