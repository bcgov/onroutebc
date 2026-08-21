import type { ValidationResults } from "onroute-policy-engine";

import { POLICY_CHECK_RESULT_TYPES } from "../../types/AxleCalculationResult";

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
      ({ result }) => result !== POLICY_CHECK_RESULT_TYPES.PASS,
    ),
  );
