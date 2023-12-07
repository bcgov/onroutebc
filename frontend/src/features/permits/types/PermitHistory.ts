import { TransactionType } from "./payment";
import { 
  PaymentCardTypeCode, 
  PaymentMethodTypeCode,
  PaymentGatewayMethod,
} from "../../../common/types/paymentMethods";

export interface PermitHistory {
  permitNumber: string;
  comment: string | null;
  commentUsername: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  pgTransactionId: string | null;
  pgPaymentMethod: PaymentGatewayMethod | null;
  paymentCardTypeCode: PaymentCardTypeCode | null;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  transactionTypeId: TransactionType;
  permitId: number;
  transactionSubmitDate: string | null;
  pgApproved: number | null;
}
