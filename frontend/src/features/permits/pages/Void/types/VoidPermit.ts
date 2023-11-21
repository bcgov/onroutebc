import { PermitStatus, PERMIT_STATUSES } from "../../../types/PermitStatus";
import { PermitsActionResponse } from "../../../types/permit";
import { 
  PaymentCardTypeCode, 
  PaymentMethodTypeCode,
  PaymentGatewayMethod,
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
}

export interface RevokePermitRequestData {
  status: Extract<PermitStatus, typeof PERMIT_STATUSES.REVOKED>;
  paymentMethodTypeCode: PaymentMethodTypeCode; // hardcoded to "WEB" - Web
  pgPaymentMethod?: PaymentGatewayMethod;
  transactionAmount: 0;
  comment: string;
}

export type VoidPermitResponseData = PermitsActionResponse;
