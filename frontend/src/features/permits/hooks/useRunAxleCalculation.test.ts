import { renderHook } from "@testing-library/react";
import { Policy } from "onroute-policy-engine";
import { vi } from "vitest";
import { useRunAxleCalculation } from "./useRunAxleCalculation";
import { PERMIT_TYPES } from "../types/PermitType";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";

describe("useRunAxleCalculation", () => {
  it("passes the selected commodity on every calculation", () => {
    const calculation = {
      results: [],
      overload: 0,
      overloadDetails: [],
      totalGCVW: 0,
    };
    const runAxleCalculation = vi.fn().mockReturnValue(calculation);
    const engine = {
      getSimplifiedVehicleConfiguration: vi.fn().mockReturnValue(["PICKRTT"]),
      runAxleCalculation,
    } as unknown as Policy;
    const { result } = renderHook(() => useRunAxleCalculation(engine));
    const vehicleDetails = {
      vehicleSubType: "PICKRTT",
    } as PermitVehicleDetails;
    for (const commodity of ["NONREDU", "EMPTYXX"]) {
      expect(
        result.current.runAxleCalculation?.(
          PERMIT_TYPES.STOW,
          vehicleDetails,
          {},
          [],
          100000,
          commodity,
        ),
      ).toBe(calculation);
      expect(runAxleCalculation).toHaveBeenLastCalledWith(
        ["PICKRTT"],
        [],
        100000,
        commodity,
      );
    }
  });
});
