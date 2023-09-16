import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";

/**
 * Calculates the fee for a permit only by its duration.
 * @param duration Number of days for duration of permit
 * @returns Fee to be paid for the permit duration
 */
export const calculateFeeByDuration = (duration: number) => {
  return duration;
};

/**
 * Gets full display text for fee summary.
 * @param feeSummary fee summary field for a permit (if exists)
 * @param duration duration field for a permit (if exists)
 * @returns display text for the fee summary (currency amount to 2 decimal places)
 */
export const feeSummaryDisplayText = (feeSummary?: string | null, duration?: number | null) => {
  const feeFromSummary = applyWhenNotNullable((numericStr) => Number(numericStr).toFixed(2), feeSummary);
  const feeFromDuration = applyWhenNotNullable((num) => calculateFeeByDuration(num).toFixed(2), duration);
  const fee = getDefaultRequiredVal("0.00", feeFromSummary, feeFromDuration);
  const numericFee = Number(fee);
  return numericFee >= 0 ? `$${fee}` : `-$${(numericFee * -1).toFixed(2)}`;
};
