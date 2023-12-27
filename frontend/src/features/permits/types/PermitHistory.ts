import { TransactionType } from "./payment";
import { RequiredOrNull } from "../../../common/types/common";
import {
  PaymentCardTypeCode,
  PaymentMethodTypeCode,
  PaymentGatewayMethod,
} from "../../../common/types/paymentMethods";

export interface PermitHistory {
  permitNumber: string;
  comment: RequiredOrNull<string>;
  commentUsername: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  pgTransactionId: RequiredOrNull<string>;
  pgPaymentMethod: RequiredOrNull<PaymentGatewayMethod>;
  paymentCardTypeCode: RequiredOrNull<PaymentCardTypeCode>;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  transactionTypeId: TransactionType;
  permitId: number;
  transactionSubmitDate: RequiredOrNull<string>;
  pgApproved: RequiredOrNull<number>;
}
