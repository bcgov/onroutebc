import { EngineResult } from 'json-rules-engine';
import { ValidationResultType } from './enum/validation-result-type.enum';

/** Represents the result of a permit application validation against policy */
class ValidationResult {
  /** Array of policy violations found during validation. */
  violations: Array<string> = [];
  /**
   * Array of additional requirements found during validation. For example,
   * a permit may require that other additional permits be applied for in
   * order to be legal.
   */
  requirements: Array<string> = [];
  /** Array of policy warnings found during validation. */
  warnings: Array<string> = [];
  /**
   * Array of policy messages found during validation. These should be
   * considered informational only and do not impact the validity of the
   * permit.
   */
  information: Array<string> = [];

  /**
   * Creates a new ValidationResult from the json-rules-engine result.
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

export default ValidationResult;
