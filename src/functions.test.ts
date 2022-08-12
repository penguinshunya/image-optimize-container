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

  it("q に無効な値を入れるとエラーが発生する", () => {
    expect(() => toQuery({ q: "invalid" })).toThrowError();
  });

  it("q に 1 未満の値を入れるとエラーが発生する", () => {
    expect(() => toQuery({ q: "0" })).toThrowError();
  });

  it("q に 101 以上の値を入れるとエラーが発生する", () => {
    expect(() => toQuery({ q: "101" })).toThrowError();
  });

  it("q に 0 以上 100 以下の値を入れるとその値が設定される", () => {
    const result = toQuery({ q: "50" });
    expect(result).toEqual({
      w: undefined,
      h: undefined,
      fm: undefined,
      q: 50,
    });
  });

  it("すべてが正しく設定される", () => {
    const result = toQuery({ w: "100", h: "200", fm: "webp", q: "50" });
    expect(result).toEqual({ w: 100, h: 200, fm: "webp", q: 50 });
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
