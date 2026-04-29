import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";

export const useCanAddAxleUnits = (policyEngine: Nullable<Policy>) => {
  return {
    canAddAxleUnitsToPowerUnit: policyEngine
      ? (
          permitType: PermitType,
          commodityType?: Nullable<string>,
          powerUnitSubtype?: Nullable<string>,
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
          commodityType?: Nullable<string>,
          powerUnitSubtype?: Nullable<string>,
          trailerSubtype?: Nullable<string>,
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
