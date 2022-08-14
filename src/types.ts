export const FORMATS = [
  "avif",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
] as const;
export type Format = typeof FORMATS[number];

export interface Query {
  w?: number;
  h?: number;
  q?: number;
  fm?: Format;
}
