import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { AxleConfiguration } from "../types/AxleUnit";

export const useCalculateGCVW = (policyEngine: Nullable<Policy>) => {
  return {
    calculateGCVW: policyEngine
      ? (axleConfig: AxleConfiguration[]) =>
          policyEngine.calculateGCVW(axleConfig)
      : undefined,
  };
};
