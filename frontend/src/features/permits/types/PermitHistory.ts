import { PaymentCardTypeCode, PaymentMethodTypeCode } from "../../../common/types/paymentMethods";
import { BamboraPaymentMethod } from "./PaymentMethod";
import { TransactionType } from "./payment";

export interface PermitHistory {
  permitNumber: string;
  comment: string | null;
  commentUsername: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  pgTransactionId: string | null;
  pgPaymentMethod: BamboraPaymentMethod | null;
  paymentCardTypeCode: PaymentCardTypeCode | null;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  transactionTypeId: TransactionType;
  permitId: number;
  transactionSubmitDate: string | null;
}
