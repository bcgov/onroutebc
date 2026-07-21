export const getLicensedGVWIncrease = (
  actualGVW?: number | null,
  licensedGVW?: number | null,
): number => {
  if (actualGVW == null || licensedGVW == null) {
    return 0;
  }

  return Math.max(0, actualGVW - licensedGVW);
};
