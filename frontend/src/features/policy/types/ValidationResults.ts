export interface ValidationResults {
  violations: ValidationResult[];
  requirements: ValidationResult[];
  warnings: ValidationResult[];
  information: ValidationResult[];
  cost: ValidationResult[];
}

interface ValidationResult {
  type: string;
  code: ViolationCodeType;
  message: string;
  fieldReference?: string;
  cost?: number;
}

export const VIOLATION_CODES = {
  COST_VALIDATION_ERROR: "cost-validation-error",
  FIELD_VALIDATION_ERROR: "field-validation-error",
};

export type ViolationCodeType =
  (typeof VIOLATION_CODES)[keyof typeof VIOLATION_CODES];
