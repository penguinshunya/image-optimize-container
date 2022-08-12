import { toMimeType, toQuery } from "./functions";

describe("toQuery", () => {
  it("何も設定されていないときはすべて undefined が設定される", () => {
    const result = toQuery({});
    expect(result).toEqual({ w: undefined, h: undefined, format: undefined });
  });

  it("w と h に整数が設定されると整数値となる", () => {
    const result = toQuery({ w: "100", h: "200" });
    expect(result).toEqual({ w: 100, h: 200, format: undefined });
  });

  it("format に無効な値を入れるとエラーが発生する", () => {
    expect(() => toQuery({ format: "invalid" })).toThrowError();
  });

  it("format に有効な値を入れるとその値が設定される", () => {
    const result = toQuery({ format: "jpeg" });
    expect(result).toEqual({ w: undefined, h: undefined, format: "jpeg" });
  });

  it("すべてが正しく設定される", () => {
    const result = toQuery({ w: "100", h: "200", format: "webp" });
    expect(result).toEqual({ w: 100, h: 200, format: "webp" });
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
