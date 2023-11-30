import { PaymentMethodAndCardTypeCodes } from "../../../../common/types/paymentMethods";

/**
 * The report issued by enum values.
 */
export const REPORT_ISSUED_BY = {
  SELF_ISSUED: "SELF_ISSUED",
  PPC: "PPC",
} as const;

/**
 * The enum type for report issued by.
 */
export type ReportIssuedByType =
  (typeof REPORT_ISSUED_BY)[keyof typeof REPORT_ISSUED_BY];

/**
 * The request object type for payment and refund summary
 */
export type PaymentAndRefundSummaryRequest = {
  issuedBy: ReportIssuedByType[];
  fromDateTime: string;
  toDateTime: string;
};

/**
 * The request object type for payment and refund detail
 */
export interface PaymentAndRefundDetailRequest
  extends PaymentAndRefundSummaryRequest {
  permitType: string[];
  paymentCodes: PaymentMethodAndCardTypeCodes[];
  users?: string[];
}

/**
 * The response structure for permit issuers.
 */
export type ReadUserDtoForReport = {
  userGUID: string;
  userName: string;
};
