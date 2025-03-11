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
  const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;
  if (transactionTypeCode === TransactionType.REFUND && amount !== 0) {
    return `-${formattedAmount}`;
  } else {
    return `${formattedAmount}`;
  }
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
