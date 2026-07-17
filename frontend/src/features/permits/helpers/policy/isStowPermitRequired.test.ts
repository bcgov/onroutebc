import { describe, expect, it } from "vitest";

import {
  AxleCalculationResult,
  POLICY_CHECK_ID_TYPES,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";
import { isStowPermitRequired } from "./isStowPermitRequired";

const createAxleCalculationResults = (
  overrides: Partial<AxleCalculationResult> = {},
): AxleCalculationResult => ({
  results: [],
  overload: 0,
  totalGCVW: 4500,
  ...overrides,
});

const requiredPermitCases: Array<{
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

describe("isStowPermitRequired", () => {
  it("returns false for a STOW application without violations, failures, or overload", () => {
    expect(
      isStowPermitRequired(
        PERMIT_TYPES.STOW,
        {},
        createAxleCalculationResults(),
      ),
    ).toBe(false);
  });

  it("allows non-blocking axle calculation warnings", () => {
    expect(
      isStowPermitRequired(
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
    ).toBe(false);
  });

  it.each(requiredPermitCases)("returns true when $name", (testCase) => {
    expect(
      isStowPermitRequired(
        testCase.permitType,
        testCase.violations,
        testCase.axleCalculationResults,
      ),
    ).toBe(true);
  });
});
