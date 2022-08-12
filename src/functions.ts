import { Format, FORMATS, Query } from "./types";

export function correctFormat(format: unknown): format is Format {
  return FORMATS.includes(format as Format);
}

export function toQuery(raw: unknown): Query {
  interface RawQuery {
    w?: string;
    h?: string;
    q?: string;
    fm?: string;
  }

  const query = raw as RawQuery;
  const w = query.w === undefined ? undefined : parseInt(query.w);
  const h = query.h === undefined ? undefined : parseInt(query.h);
  if ((w !== undefined && isNaN(w)) || (h !== undefined && isNaN(h))) {
    throw new Error("Invalid query: w and h must be number");
  }
  const q = query.q === undefined ? undefined : parseInt(query.q);
  if (q !== undefined && isNaN(q)) {
    throw new Error("Invalid query: q must be number");
  }
  if (q !== undefined && q < 1) {
    throw new Error("Invalid query: q must be greater than 0");
  }
  if (q !== undefined && q > 100) {
    throw new Error("Invalid query: q must be less than 100");
  }
  if (query.fm !== undefined && !correctFormat(query.fm)) {
    throw new Error(
      "Invalid format: format must be one of avif, gif, jpeg, jpg, png, webp"
    );
  }
  const fm = query.fm;
  return { w, h, q, fm };
}

export function toMimeType(format: Format): string {
  if (format === "jpg") {
    return "image/jpeg";
  } else {
    return `image/${format}`;
  }
}
