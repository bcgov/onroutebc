import { EngineResult } from 'json-rules-engine';
import { ValidationResultType } from './enum/validation-result-type';
import { ValidationResultCode } from './enum/validation-result-code';
import { ValidationResult } from './validation-result';

/** Represents the results of a permit application validation against policy */
export class ValidationResults {
  /** Array of policy violations found during validation. */
  violations: Array<ValidationResult> = [];
  /**
   * Array of additional requirements found during validation. For example,
   * a permit may require that other additional permits be applied for in
   * order to be legal.
   */
  requirements: Array<ValidationResult> = [];
  /** Array of policy warnings found during validation. */
  warnings: Array<ValidationResult> = [];
  /**
   * Array of policy messages found during validation. These should be
   * considered informational only and do not impact the validity of the
   * permit.
   */
  information: Array<ValidationResult> = [];
  /**
   * Array of cost messages, based on cost rules. If there are more than
   * one cost message, all should be summed to get the total permit cost.
   */
  cost: Array<ValidationResult> = [];

  /**
   * Creates a new ValidationResults from the json-rules-engine result.
   * Populates the violations, requirements, warnings, and messages arrays
   * based on the events in the json-rules-engine result.
   * @param engineResult json-rules-engine run result.
   */
  constructor(engineResult?: EngineResult) {
    if (engineResult) {
      engineResult.events.forEach((e) => {
        const message: string =
          e.params?.message ??
          `Unknown message: params=${JSON.stringify(e.params)}`;
        const code: string =
          e.params?.code ?? ValidationResultCode.GeneralResult;
        const type: string =
          e.type ?? ValidationResultType.Violation.toString();

        const result: ValidationResult = new ValidationResult(
          type,
          code,
          message,
        );
        result.fieldReference = e.params?.fieldReference;
        result.cost = e.params?.cost;

        switch (type) {
          case ValidationResultType.Violation:
            this.violations.push(result);
            break;
          case ValidationResultType.Requirement:
            this.requirements.push(result);
            break;
          case ValidationResultType.Warning:
            this.warnings.push(result);
            break;
          case ValidationResultType.Information:
            this.information.push(result);
            break;
          case ValidationResultType.Cost:
            this.cost.push(result);
            break;
          default:
            // Treat any unknown validation event as a violation since
            // it is an unexpected scenario.
            console.log('Unknown validation event encountered');
            this.violations.push(
              new ValidationResult(
                ValidationResultType.Violation,
                ValidationResultCode.GeneralResult,
                'Unknown validation event encountered',
              ),
            );
        }
      });
    }
  }
}
