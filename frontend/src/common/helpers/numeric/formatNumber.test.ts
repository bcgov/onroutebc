import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it.each([
    [999, undefined, "999"],
    [1000, undefined, "1,000"],
    [70660, undefined, "70,660"],
    [1234.5, 2, "1,234.50"],
  ])(
    "formats %s with %s decimal places as %s",
    (value, decimalPlaces, expected) => {
      expect(formatNumber(value, decimalPlaces)).toBe(expected);
    },
  );

  it.each([null, undefined])("returns undefined for %s", (value) => {
    expect(formatNumber(value)).toBeUndefined();
  });
});
