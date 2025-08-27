import { RequiredOrNull } from "../../../../../common/types/common";
import {
  PaymentCardTypeCode,
  PaymentGatewayMethod,
  PaymentMethodTypeCode,
} from "../../../../../common/types/paymentMethods";
import { CreditAccountStatusType } from "../../../../settings/types/creditAccount";
import { TransactionType } from "../../../types/payment";

export interface RefundFormData {
  permitNumber: string;
  pgPaymentMethod: RequiredOrNull<PaymentGatewayMethod>;
  pgTransactionId: RequiredOrNull<string>;
  transactionOrderNumber: string;
  transactionTypeId: TransactionType;
  paymentCardTypeCode: RequiredOrNull<PaymentCardTypeCode>;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  transactionAmount: number;
  refundAmount: string;
  refundTransactionId: RequiredOrNull<string>;
  chequeRefund: boolean;
  creditAccountMismatch: RequiredOrNull<boolean>;
  creditAccountStatusType: RequiredOrNull<CreditAccountStatusType>;
}
