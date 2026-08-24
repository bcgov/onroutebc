const commaSeparatedNumberFormatter = new Intl.NumberFormat("en-CA", {
  maximumFractionDigits: 20,
});

export const formatNumberWithCommas = (value: number): string =>
  commaSeparatedNumberFormatter.format(value);
