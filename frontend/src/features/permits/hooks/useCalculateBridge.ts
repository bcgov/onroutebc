import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { AxleConfiguration } from "../types/AxleUnit";

export const useCalculateBridge = (policyEngine: Nullable<Policy>) => {
  return {
    calculateBridge: policyEngine
      ? (axleConfig: AxleConfiguration[]) =>
          policyEngine.calculateBridge(axleConfig)
      : undefined,
  };
};
