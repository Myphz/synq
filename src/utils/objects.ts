export const removeBlanks = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, val]) => !!val)
  ) as Partial<T>;
};

export const isObjectBlank = (obj: Record<string, unknown>) =>
  Object.keys(obj).length === 0;

export const splitArrayIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
};
