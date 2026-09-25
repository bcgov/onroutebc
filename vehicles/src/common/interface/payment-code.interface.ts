import { PaymentCardType } from '@common/enum/payment-card-type.enum';
import { PaymentMethodTypeReport } from '@common/enum/payment-method-type.enum';

export interface IPaymentCode {
  paymentMethodTypeCode: PaymentMethodTypeReport;
  paymentCardTypeCode?: PaymentCardType;
  consolidatedPaymentMethod?: string;
}
