import type { ValidationResults } from "onroute-policy-engine";

import {
  POLICY_CHECK_ID_TYPES,
  POLICY_CHECK_RESULT_TYPES,
} from "../../types/AxleCalculationResult";

type PolicyValidationIssues = {
  warnings?: ValidationResults["warnings"];
  violations?: ValidationResults["violations"];
  axleCalculationResults?: ValidationResults["axleCalculationResults"];
};

/** Returns true when policy validation finds a warning, violation, or axle check that does not pass. */
export const hasPolicyValidationIssues = ({
  warnings = [],
  violations = [],
  axleCalculationResults,
}: PolicyValidationIssues) =>
  warnings.length > 0 ||
  violations.length > 0 ||
  Boolean(
    axleCalculationResults?.results.some(
      ({ id, result }) =>
        result !== POLICY_CHECK_RESULT_TYPES.PASS &&
        // Explicitly ignore warnings for LEGAL_WEIGHT, which are not violation errors.
        // In future if we have to handle more warnings, refactor this based on warning
        // behaviour.
        !(
          id === POLICY_CHECK_ID_TYPES.LEGAL_WEIGHT &&
          result === POLICY_CHECK_RESULT_TYPES.WARNING
        ),
    ),
  );
