import { Format, FORMATS, Query } from "./types";

export function correctFormat(format: unknown): format is Format {
  return FORMATS.includes(format as Format);
}

export function toQuery(raw: unknown): Query {
  interface RawQuery {
    w?: string;
    h?: string;
    fm?: string;
  }

  const q = raw as RawQuery;
  const w = q.w === undefined ? undefined : parseInt(q.w);
  const h = q.h === undefined ? undefined : parseInt(q.h);
  if ((w !== undefined && isNaN(w)) || (h !== undefined && isNaN(h))) {
    throw new Error("Invalid query: w and h must be number");
  }
  if (q.fm !== undefined && !correctFormat(q.fm)) {
    throw new Error(
      "Invalid format: format must be one of avif, gif, jpeg, jpg, png, webp"
    );
  }
  const fm = q.fm;
  return { w, h, fm };
}

export function toMimeType(format: Format): string {
  if (format === "jpg") {
    return "image/jpeg";
  } else {
    return `image/${format}`;
  }
}
