import { Cache } from 'cache-manager';
import { CacheKey } from '../enum/cache-key.enum';
import { PaymentCardType } from '../enum/payment-card-type.enum';
import {
  CfsPaymentMethodType,
  ExtendedPaymentMethodType,
  PaymentMethodType,
} from '../enum/payment-method-type.enum';
import { getFromCache } from './cache.helper';
import { IPaymentCode } from '../interface/payment-code.interface';
import { TransactionType } from '../enum/transaction-type.enum';

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
  const amountToFormat =
    transactionTypeCode === TransactionType.REFUND && amount !== 0
      ? -1 * Math.abs(amount)
      : Math.abs(amount);

  return amountToFormat.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'symbol',
  });
};

export const isCfsPaymentMethodType = (
  paymentMethodType: PaymentMethodType,
): paymentMethodType is CfsPaymentMethodType => {
  return paymentMethodType in CfsPaymentMethodType;
};

export const isTransactionPurchase = (transactionType: TransactionType) => {
  return transactionType == TransactionType.PURCHASE;
};

export const isWebTransactionPurchase = (
  paymentMethod: PaymentMethodType,
  transactionType: TransactionType,
) => {
  return (
    paymentMethod == PaymentMethodType.WEB &&
    isTransactionPurchase(transactionType)
  );
};
