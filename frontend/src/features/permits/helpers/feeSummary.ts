import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { PermitHistory } from "../types/PermitHistory";
import { TRANSACTION_TYPES, TransactionType } from "../types/payment.d";

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

/**
 * Determines whether or not the transaction type of a transaction was a refund.
 * @param transactionType Transaction type of a transaction
 * @returns whether or not the transaction type was a refund
 */
export const isTransactionTypeRefund = (transactionType: TransactionType) => {
  return transactionType === TRANSACTION_TYPES.R;
};

/**
 * Calculates the net amount from the history of transactions for a permit.
 * A positive amount represents the net amount that was paid for a permit, and
 * a negative amount represents the net amount that was refunded for a permit, and
 * a 0 amount means that the permit is completely paid with no amount outstanding.
 * @param permitHistory List of history objects that make up the history of a permit
 * @returns total net amount resulting from the history of transactions for the permit
 */
export const calculateNetAmount = (permitHistory: PermitHistory[]) => {
  return permitHistory.map(permit => isTransactionTypeRefund(permit.transactionTypeId) 
    ? -1 * permit.transactionAmount 
    : permit.transactionAmount).reduce((prev, curr) => prev + curr, 0);
};

/**
 * Calculates the amount that needs to be refunded (or paid if amount is negative) for a permit given a new duration period.
 * @param permitHistory List of history objects that make up the history of a permit and its transactions
 * @param currDuration Current (updated) duration of the permit
 * @returns Amount that needs to be refunded, or if negative then the amount that still needs to be paid
 */
export const calculateAmountToRefund = (permitHistory: PermitHistory[], currDuration: number) => {
  const netPaid = calculateNetAmount(permitHistory);
  const feeForCurrDuration = calculateFeeByDuration(currDuration);
  return netPaid - feeForCurrDuration;
};
