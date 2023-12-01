import { Cache } from 'cache-manager';
import { CacheKey } from '../enum/cache-key.enum';
import { PaymentCardType } from '../enum/payment-card-type.enum';
import {
  ExtendedPaymentMethodType,
  PaymentMethodType,
} from '../enum/payment-method-type.enum';
import { getFromCache } from './cache.helper';
import { IPaymentCode } from '../interface/payment-code.interface';

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
