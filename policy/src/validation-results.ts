import { EngineResult } from 'json-rules-engine';
import { ValidationResultType } from './enum/validation-result-type.enum';
import { ValidationResult } from './validation-result';

/** Represents the results of a permit application validation against policy */
class ValidationResults {
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
   * Creates a new ValidationResults from the json-rules-engine result.
   * Populates the violations, requirements, warnings, and messages arrays
   * based on the events in the json-rules-engine result.
   * @param engineResult json-rules-engine run result.
   */
  constructor(engineResult?: EngineResult) {
    if (engineResult) {
      engineResult.events.forEach((e) => {
        let message: string;
        if (e.params && e.params.message) {
          message = e.params.message;
        } else {
          // All events should have a message, if there is no message
          // push the entire params in (likely error scenario).
          message = `Unknown message: params=${JSON.stringify(e.params)}`;
        }

        switch (e.type) {
          case ValidationResultType.Violation:
            this.violations.push(message);
            break;
          case ValidationResultType.Requirement:
            this.requirements.push(message);
            break;
          case ValidationResultType.Warning:
            this.warnings.push(message);
            break;
          case ValidationResultType.Information:
            this.information.push(message);
            break;
          default:
            // Treat any unknown validation event as a violation since
            // it is an unexpected scenario.
            console.log('Unknown validation event encountered');
            this.violations.push(message);
        }
      });
    }
  }
}

export default ValidationResults;
