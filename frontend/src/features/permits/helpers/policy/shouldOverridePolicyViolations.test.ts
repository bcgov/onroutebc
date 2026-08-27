import { describe, expect, it } from "vitest";

import {
  AxleCalculationResult,
  POLICY_CHECK_ID_TYPES,
  POLICY_CHECK_RESULT_TYPES,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES } from "../../types/PermitType";
import { shouldOverridePolicyViolations } from "./shouldOverridePolicyViolations";

const axleCalculationResults = (
  result: AxleCalculationResult["results"][number],
): AxleCalculationResult => ({
  results: [result],
  overload: 1,
  totalGCVW: 6001,
});

const canProceed = (result: AxleCalculationResult["results"][number]) =>
  shouldOverridePolicyViolations(
    {},
    axleCalculationResults(result),
    false,
    PERMIT_TYPES.STOW,
    false,
  );

describe("shouldOverridePolicyViolations", () => {
  it("allows a non-staff STOW applicant to proceed with a legal-weight warning", () => {
    expect(
      canProceed({
        id: POLICY_CHECK_ID_TYPES.LEGAL_WEIGHT,
        result: POLICY_CHECK_RESULT_TYPES.WARNING,
        message: "Above legal weight",
        startAxleUnit: 1,
        endAxleUnit: 1,
      }),
    ).toBe(true);
  });

  it("blocks a non-staff STOW applicant with a permittable-weight failure", () => {
    expect(
      canProceed({
        id: POLICY_CHECK_ID_TYPES.PERMITTABLE_WEIGHT,
        result: POLICY_CHECK_RESULT_TYPES.FAIL,
        message: "Above permittable weight",
        startAxleUnit: 1,
        endAxleUnit: 1,
      }),
    ).toBe(false);
  });

  it("blocks a non-staff STOW applicant when another axle check fails", () => {
    expect(
      canProceed({
        id: POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA,
        result: POLICY_CHECK_RESULT_TYPES.FAIL,
        message: "Bridge Formula failed",
        startAxleUnit: 1,
        endAxleUnit: 2,
      }),
    ).toBe(false);
  });
});
