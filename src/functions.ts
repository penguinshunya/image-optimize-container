import { Format, FORMATS, Query } from "./types";

export function correctFormat(format: unknown): format is Format {
  return FORMATS.includes(format as Format);
}

export function toQuery(raw: unknown): Query {
  interface RawQuery {
    w?: string;
    h?: string;
    format?: string;
  }

  const q = raw as RawQuery;
  const w = q.w === undefined ? undefined : parseInt(q.w);
  const h = q.h === undefined ? undefined : parseInt(q.h);
  if ((w !== undefined && isNaN(w)) || (h !== undefined && isNaN(h))) {
    throw new Error("Invalid query: w and h must be number");
  }
  if (q.format !== undefined && !correctFormat(q.format)) {
    throw new Error(
      "Invalid format: format must be one of avif, gif, jpeg, jpg, png, webp"
    );
  }
  const format = q.format;
  return { w, h, format };
}

export function toMimeType(format: Format): string {
  if (format === "jpg") {
    return "image/jpeg";
  } else {
    return `image/${format}`;
  }
}
