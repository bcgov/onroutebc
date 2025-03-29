import { TransactionType } from '../enum/transaction-type.enum';
import { PermitHistoryDto } from 'src/modules/permit-application-payment/permit/dto/response/permit-history.dto';
import { NotAcceptableException } from '@nestjs/common';
import * as dayjs from 'dayjs';

export const leapYear = (
  duration: number,
  startDate: string,
  expiryDate: string,
): boolean => {
  const start = dayjs(startDate, 'YYYY-MM-DD');
  const expiry = dayjs(expiryDate, 'YYYY-MM-DD');
  const isOneYear =
    start.add(1, 'year').subtract(1, 'day').toDate() === expiry.toDate();
  return duration === 366 && isOneYear;
};

export const calculatePermitAmount = (
  permitPaymentHistory: PermitHistoryDto[],
): number => {
  let amount = 0;
  for (const payment of permitPaymentHistory) {
    switch (payment.transactionTypeId) {
      case TransactionType.REFUND:
        amount -= payment.transactionAmount;
        break;
      case TransactionType.PURCHASE:
        amount += payment.transactionAmount;
        break;
      case TransactionType.VOID_PURHCASE:
      case TransactionType.VOID_REFUND:
        throw new NotAcceptableException();
      default:
        throw new NotAcceptableException();
    }
  }

  return amount;
};

export const validateAmountReceived = (
  cost: number,
  receivedAmount: number,
  transactionType: TransactionType,
): boolean => {
  const isAmountValid = receivedAmount.toFixed(2) === Math.abs(cost).toFixed(2);

  // For refund transactions, ensure the calculated cost is negative.
  const isRefundValid = cost < 0 && transactionType === TransactionType.REFUND;

  // Return true if the amounts are valid or if it's a valid refund transaction
  return (
    isAmountValid &&
    (isRefundValid || transactionType !== TransactionType.REFUND)
  );
};
