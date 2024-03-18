import { Cache } from 'cache-manager';
import { CacheKey } from '../enum/cache-key.enum';
import { PaymentCardType } from '../enum/payment-card-type.enum';
import {
  ExtendedPaymentMethodType,
  PaymentMethodType,
} from '../enum/payment-method-type.enum';
import { getFromCache } from './cache.helper';
import { IPaymentCode } from '../interface/payment-code.interface';
import { TransactionType } from '../enum/transaction-type.enum';
import { PermitHistoryDto } from 'src/modules/permit-application-payment/permit/dto/response/permit-history.dto';
import { NotAcceptableException } from '@nestjs/common';

export const getPaymentCodeFromCache = async (
  cacheManager: Cache,
  paymentMethodTypeCode: PaymentMethodType | ExtendedPaymentMethodType,
  paymentCardTypeCode?: PaymentCardType,
): Promise<IPaymentCode> => {
  const paymentCodeDesc = paymentCardTypeCode
    ? await getFromCache(
        cacheManager,
        CacheKey.PAYMENT_CARD_TYPE,
        paymentCardTypeCode,
      )
    : null;
  const paymentMethodDesc = await getFromCache(
    cacheManager,
    CacheKey.PAYMENT_METHOD_TYPE,
    paymentMethodTypeCode,
  );
  const paymentCode: IPaymentCode = {
    paymentMethodTypeCode: paymentMethodTypeCode,
    paymentCardTypeCode: paymentCardTypeCode,
    consolidatedPaymentMethod:
      paymentMethodDesc + (paymentCodeDesc ? ' - ' + paymentCodeDesc : ''),
  };

  return paymentCode;
};

export const formatAmount = (
  transactionTypeCode: TransactionType,
  amount: number,
): string => {
  const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;
  if (transactionTypeCode === TransactionType.REFUND && amount !== 0) {
    return `-${formattedAmount}`;
  } else {
    return `${formattedAmount}`;
  }
};

/**
 * Calculates the permit fee based on the provided duration, price per term, permit type term, and old amount.
 *
 * @param {number} duration The duration for which the permit is required.
 * @param {number} pricePerTerm The price per term of the permit.
 * @param {number} allowedPermitTerm The term of the permit type.
 * @param {number} oldAmount The old amount (if any) for the permit.
 * @returns {number} The calculated permit fee.
 */
export const permitFee = (
  duration: number,
  pricePerTerm: number,
  allowedPermitTerm: number,
  oldAmount: number,
): number => {
  const permitTerms = Math.ceil(duration / allowedPermitTerm);
  return oldAmount > 0
    ? pricePerTerm * permitTerms - oldAmount
    : pricePerTerm * permitTerms + oldAmount;
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
