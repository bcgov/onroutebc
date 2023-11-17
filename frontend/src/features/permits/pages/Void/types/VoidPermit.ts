import { PaymentMethodTypeCode } from "../../../../../common/types/paymentMethods";
import { BamboraPaymentMethod, CardType } from "../../../types/PaymentMethod";
import { PermitStatus } from "../../../types/PermitStatus";
import { PermitsActionResponse } from "../../../types/permit";

export interface VoidPermitFormData {
  permitId: string;
  reason: string;
  revoke: boolean;
  email?: string;
  fax?: string;
}

export interface VoidPermitRequestData {
  status: Extract<PermitStatus, "VOIDED">;
  pgTransactionId?: string;
  paymentMethodTypeCode: PaymentMethodTypeCode; // hardcoded to "WEB" - Web
  transactionAmount: number;
  pgTransactionDate?: string;
  pgPaymentMethod?: BamboraPaymentMethod;
  pgCardType?: CardType;
  comment: string;
}

export interface RevokePermitRequestData {
  status: Extract<PermitStatus, "REVOKED">;
  paymentMethodTypeCode: PaymentMethodTypeCode; // hardcoded to "WEB" - Web
  pgPaymentMethod?: BamboraPaymentMethod;
  transactionAmount: 0;
  comment: string;
}

export type VoidPermitResponseData = PermitsActionResponse;
