import { ValidationResults } from "./ValidationResults";

export interface VaildationError {
  message: string;
  errorCode: "VALIDATION_FAILURE";
  additionalInfo: ValidationResults;
}
