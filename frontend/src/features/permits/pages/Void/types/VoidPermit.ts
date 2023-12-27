import { PermitStatus, PERMIT_STATUSES } from "../../../types/PermitStatus";
import { PermitsActionResponse } from "../../../types/permit";
import { TRANSACTION_TYPES, TransactionType } from "../../../types/payment.d";
import {
  PaymentCardTypeCode,
  PaymentMethodTypeCode,
  PaymentGatewayMethod,
  PAYMENT_METHOD_TYPE_CODE,
} from "../../../../../common/types/paymentMethods";

export interface VoidPermitFormData {
  permitId: string;
  reason: string;
  revoke: boolean;
  email?: string;
  fax?: string;
}

export interface VoidPermitRequestData {
  status: Extract<PermitStatus, typeof PERMIT_STATUSES.VOIDED>;
  pgTransactionId?: string;
  paymentMethodTypeCode: PaymentMethodTypeCode;
  transactionAmount: number;
  pgTransactionDate?: string;
  pgPaymentMethod?: PaymentGatewayMethod;
  pgCardType?: PaymentCardTypeCode;
  comment: string;
  transactionTypeId: TransactionType;
}

export interface RevokePermitRequestData {
  status: Extract<PermitStatus, typeof PERMIT_STATUSES.REVOKED>;
  paymentMethodTypeCode: typeof PAYMENT_METHOD_TYPE_CODE.NP;
  pgPaymentMethod?: PaymentGatewayMethod;
  transactionAmount: 0;
  comment: string;
  transactionTypeId: typeof TRANSACTION_TYPES.P;
}

export type VoidPermitResponseData = PermitsActionResponse;
