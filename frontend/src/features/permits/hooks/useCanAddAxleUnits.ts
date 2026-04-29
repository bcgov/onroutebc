import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";

export const useCanAddAxleUnits = (policyEngine: Nullable<Policy>) => {
  return {
    canAddAxleUnitsToPowerUnit: policyEngine
      ? (
          permitType: PermitType,
          commodityType?: string | null,
          powerUnitSubtype?: string | null,
        ) =>
          policyEngine.canAddAxleUnitsToPowerUnit(
            permitType,
            commodityType,
            powerUnitSubtype,
          )
      : undefined,
    canAddAxleUnitsToTrailer: policyEngine
      ? (
          permitType: PermitType,
          commodityType?: string | null,
          powerUnitSubtype?: string | null,
          trailerSubtype?: string | null,
        ) =>
          policyEngine.canAddAxleUnitsToTrailer(
            permitType,
            commodityType,
            powerUnitSubtype,
            trailerSubtype,
          )
      : undefined,
  };
};
