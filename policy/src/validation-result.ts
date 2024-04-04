import { EngineResult, Event } from "json-rules-engine";
import { ValidationResultType } from "./enum/validation-result-type.enum";

class ValidationResult {
  violations: Array<string> = [];
  requirements: Array<string> = [];
  warnings: Array<string> = [];
  messages: Array<string> = [];

  constructor(engineResult?: EngineResult) {
    if (engineResult) {
      engineResult.events.forEach((e) => {
        let message: string;
        if (e.params?.message) {
          message = e.params?.message;
        } else {
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
          case ValidationResultType.Message:
            this.warnings.push(message);
            break;
          default:
            console.log('Unknown validation event encountered');
            this.violations.push(message);
        }
      });
    }
  }
}

export default ValidationResult;