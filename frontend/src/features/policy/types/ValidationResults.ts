export interface ValidationResults {
  violations: ValidationResult[];
  requirements: ValidationResult[];
  warnings: ValidationResult[];
  information: ValidationResult[];
  cost: ValidationResult[];
}

interface ValidationResult {
  type: string;
  code: string;
  message: string;
  fieldReference?: string;
  cost?: number;
}
