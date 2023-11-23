import {
  PaymentCardTypeCode,
  PaymentMethodTypeCode,
} from "../../../../../common/types/paymentMethods";
import { BamboraPaymentMethod } from "../../../types/PaymentMethod";
import { PermitStatus, PERMIT_STATUSES } from "../../../types/PermitStatus";
import { PermitsActionResponse } from "../../../types/permit";

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
  pgPaymentMethod?: BamboraPaymentMethod;
  pgCardType?: PaymentCardTypeCode;
  comment: string;
}

export interface RevokePermitRequestData {
  status: Extract<PermitStatus, typeof PERMIT_STATUSES.REVOKED>;
  paymentMethodTypeCode: PaymentMethodTypeCode; // hardcoded to "WEB" - Web
  pgPaymentMethod?: BamboraPaymentMethod;
  transactionAmount: 0;
  comment: string;
}

export type VoidPermitResponseData = PermitsActionResponse;
