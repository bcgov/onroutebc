import { ValidationResults } from "./ValidationResults";

export const PAYMENT_ERRORS = {
  VALIDATION_FAILURE: "VALIDATION_FAILURE",
  TRANS_INVALID_APPLICATION_STATUS: "TRANS_INVALID_APPLICATION_STATUS",
  CREDIT_ACCOUNT_MISMATCH: "CREDIT_ACCOUNT_MISMATCH",
};

export type PaymentErrorType =
  (typeof PAYMENT_ERRORS)[keyof typeof PAYMENT_ERRORS];

export interface PaymentError {
  message: string;
  errorCode: PaymentErrorType;
  additionalInfo: ValidationResults;
}
