import { correctFormat, toMimeType, toQuery } from "./functions";

describe("correctFormat", () => {
  it("undefined であれば false を返す", () => {
    expect(correctFormat(undefined)).toBe(false);
  });

  it("webp であれば true を返す", () => {
    expect(correctFormat("webp")).toBe(true);
  });

  it("avif であれば true を返す", () => {
    expect(correctFormat("avif")).toBe(true);
  });

  it("gif であれば true を返す", () => {
    expect(correctFormat("gif")).toBe(true);
  });
});

describe("toQuery", () => {
  it("何も設定されていないときはすべて undefined が設定される", () => {
    const result = toQuery({});
    expect(result).toEqual({ w: undefined, h: undefined, fm: undefined });
  });

  it("w と h に整数が設定されると整数値となる", () => {
    const result = toQuery({ w: "100", h: "200" });
    expect(result).toEqual({ w: 100, h: 200, fm: undefined });
  });

  it("fm に無効な値を入れるとエラーが発生する", () => {
    expect(() => toQuery({ fm: "invalid" })).toThrowError();
  });

  it("fm に有効な値を入れるとその値が設定される", () => {
    const result = toQuery({ fm: "jpeg" });
    expect(result).toEqual({ w: undefined, h: undefined, fm: "jpeg" });
  });

  it("すべてが正しく設定される", () => {
    const result = toQuery({ w: "100", h: "200", fm: "webp" });
    expect(result).toEqual({ w: 100, h: 200, fm: "webp" });
  });
});

describe("toMimeType", () => {
  it("jpg は image/jpeg に変換される", () => {
    const result = toMimeType("jpg");
    expect(result).toEqual("image/jpeg");
  });

  it("その他は image/{format} に変換される", () => {
    const result = toMimeType("png");
    expect(result).toEqual("image/png");
  });
});
