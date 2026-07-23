export const getLicensedGVWIncrease = (
  actualGVW: number,
  licensedGVW: number,
): number => Math.max(0, actualGVW - licensedGVW);
