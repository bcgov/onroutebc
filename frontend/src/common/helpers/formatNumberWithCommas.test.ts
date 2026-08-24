import { formatNumberWithCommas } from "./formatNumberWithCommas";

describe("formatNumberWithCommas", () => {
  it.each([
    [999, "999"],
    [1000, "1,000"],
    [10000, "10,000"],
    [70660, "70,660"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatNumberWithCommas(value)).toBe(expected);
  });
});
