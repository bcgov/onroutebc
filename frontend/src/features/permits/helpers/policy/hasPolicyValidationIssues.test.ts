import { describe, expect, it } from "vitest";
import {
  PolicyCheckId,
  PolicyCheckResultType,
} from "onroute-policy-engine/enum";

import { hasPolicyValidationIssues } from "./hasPolicyValidationIssues";

const axleResult = (id: PolicyCheckId, result: PolicyCheckResultType) => ({
  id,
  result,
  message: "Policy result",
  startAxleUnit: 1,
  endAxleUnit: 1,
});

describe("hasPolicyValidationIssues", () => {
  it("ignores a silent legal-weight warning", () => {
    expect(
      hasPolicyValidationIssues({
        axleCalculationResults: {
          results: [
            axleResult(
              PolicyCheckId.LegalWeight,
              PolicyCheckResultType.Warning,
            ),
          ],
          overload: 1,
          overloadDetails: [],
          totalGCVW: 6001,
        },
      }),
    ).toBe(false);
  });

  it("continues to report other axle warnings", () => {
    expect(
      hasPolicyValidationIssues({
        axleCalculationResults: {
          results: [
            axleResult(
              PolicyCheckId.WheelbaseLegalLimits,
              PolicyCheckResultType.Warning,
            ),
          ],
          overload: 0,
          overloadDetails: [],
          totalGCVW: 6000,
        },
      }),
    ).toBe(true);
  });

  it("continues to report failed axle checks", () => {
    expect(
      hasPolicyValidationIssues({
        axleCalculationResults: {
          results: [
            axleResult(
              PolicyCheckId.PermittableWeight,
              PolicyCheckResultType.Fail,
            ),
          ],
          overload: 0,
          overloadDetails: [],
          totalGCVW: 23001,
        },
      }),
    ).toBe(true);
  });
});
