export type EmptyObject = Record<string, never>;

export type FontAttributes = {
  font: string;
  sizes: Record<string | number, number[]>;
} & Partial<{
  lineHeight: number;
  letterSpacing: number;
}>;

export type FontHierarchy = Record<string, FontAttributes>;
