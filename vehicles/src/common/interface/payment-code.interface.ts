import { PaymentCardType } from '../enum/payment-card-type.enum';
import { PaymentMethodTypeReport } from '../enum/payment-method-type.enum';

export interface IPaymentCode {
  paymentMethodTypeCode: PaymentMethodTypeReport;
  paymentCardTypeCode?: PaymentCardType;
  consolidatedPaymentMethod?: string;
}
