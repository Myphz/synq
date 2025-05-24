import { throwError } from "./throw-error";

export const getElementByName = (name: string) => {
  const elements = document.getElementsByName(name);

  const element = elements?.[0];

  if (!element) throwError(`HTML field with name ${name} missing!`);
  if (elements.length > 1)
    throwError(`There are multiple HTML fields with name ${name}!`);

  return element;
};

export const applyFormDefaultValues = (
  defaultValues: Record<string, unknown>
) => {
  const names = Object.keys(defaultValues);
  if (!names.length) return;

  names.forEach((name) => {
    const input = getElementByName(name) as HTMLInputElement;
    // Don't apply default value if input has already a value
    if (input.value.trim()) return;
    // @ts-expect-error defaultValues is already validated by zod - it's ok
    input.value = defaultValues[name];
  });
};

export const generateId = () =>
  "RAND_ID_xxxx-xxxx-xxx-xxxx".replaceAll(/[x]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
