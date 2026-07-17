import { describe, expect, it } from "vitest";

import {
  AxleCalculationResult,
  POLICY_CHECK_ID_TYPES,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";
import { isStowPermitNotRequired } from "./isStowPermitNotRequired";

const createAxleCalculationResults = (
  overrides: Partial<AxleCalculationResult> = {},
): AxleCalculationResult => ({
  results: [],
  overload: 0,
  totalGCVW: 4500,
  ...overrides,
});

const nonQualifyingCases: Array<{
  name: string;
  permitType: PermitType;
  violations: Record<string, string>;
  axleCalculationResults: AxleCalculationResult;
}> = [
  {
    name: "the application has a policy violation",
    permitType: PERMIT_TYPES.STOW,
    violations: { field: "Invalid value" },
    axleCalculationResults: createAxleCalculationResults(),
  },
  {
    name: "the axle calculation has a failed check",
    permitType: PERMIT_TYPES.STOW,
    violations: {},
    axleCalculationResults: createAxleCalculationResults({
      results: [
        {
          id: POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA,
          result: "fail",
          message: "Bridge calculation failed.",
          startAxleUnit: 1,
          endAxleUnit: 2,
        },
      ],
    }),
  },
  {
    name: "the application has an overload",
    permitType: PERMIT_TYPES.STOW,
    violations: {},
    axleCalculationResults: createAxleCalculationResults({ overload: 1 }),
  },
  {
    name: "the permit is not STOW",
    permitType: PERMIT_TYPES.STOS,
    violations: {},
    axleCalculationResults: createAxleCalculationResults(),
  },
];

describe("isStowPermitNotRequired", () => {
  it("returns true for a STOW application without violations, failures, or overload", () => {
    expect(
      isStowPermitNotRequired(
        PERMIT_TYPES.STOW,
        {},
        createAxleCalculationResults(),
      ),
    ).toBe(true);
  });

  it("allows non-blocking axle calculation warnings", () => {
    expect(
      isStowPermitNotRequired(
        PERMIT_TYPES.STOW,
        {},
        createAxleCalculationResults({
          results: [
            {
              id: POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA,
              result: "warning",
              message: "Check this configuration.",
              startAxleUnit: 1,
              endAxleUnit: 2,
            },
          ],
        }),
      ),
    ).toBe(true);
  });

  it.each(nonQualifyingCases)("returns false when $name", (testCase) => {
    expect(
      isStowPermitNotRequired(
        testCase.permitType,
        testCase.violations,
        testCase.axleCalculationResults,
      ),
    ).toBe(false);
  });
});
