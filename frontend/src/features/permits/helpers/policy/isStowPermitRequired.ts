import {
  AxleCalculationResult,
  POLICY_CHECK_RESULT_TYPES,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";

export const isStowPermitRequired = (
  permitType: PermitType,
  violations: Record<string, string>,
  axleCalculationResults: AxleCalculationResult,
) =>
  permitType !== PERMIT_TYPES.STOW ||
  Object.keys(violations).length > 0 ||
  axleCalculationResults.overload > 0 ||
  axleCalculationResults.results.some(
    ({ result }) => result === POLICY_CHECK_RESULT_TYPES.FAIL,
  );
