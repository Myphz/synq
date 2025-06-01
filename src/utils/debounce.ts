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
