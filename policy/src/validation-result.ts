import { ValidationResultType } from './enum/validation-result-type.enum';

/**
 * Represents a single validation result when a permit application is
 * validated against policy. A single validation run can result in multiple
 * validation result messages.
 */
export class ValidationResult {
  /**
   * Creates a new ValidationResult from the supplied type, code, and message.
   *
   * @param type type of result, one of the ValidationResultType enum
   * @param code code for identifying common categories of results
   * @param message text message describing the result
   */
  constructor(type: ValidationResultType, code: number, message: string) {
    this.type = type;
    this.code = code;
    this.message = message;
  }

  type: ValidationResultType;
  code: number;
  message: string;
  fieldReference?: string;
}

export default ValidationResult;