import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { AxleConfiguration } from "onroute-policy-engine/types";

export const useCalculateBridge = (policyEngine: Nullable<Policy>) => {
  return {
    calculateBridge: policyEngine
      ? (axleConfig: AxleConfiguration[]) =>
          policyEngine.calculateBridge(axleConfig)
      : undefined,
  };
};
