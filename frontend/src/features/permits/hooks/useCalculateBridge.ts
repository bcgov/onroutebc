import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { AxleConfiguration } from "../types/AxleUnit";

export const useCalculateBridge = (policyEngine: Nullable<Policy>) => {
  return {
    calculateBridge: policyEngine
      ? (axleConfig: AxleConfiguration[]) =>
          // we pass in an empty object for VehicleConfiguration here since it is not relevant for calculateBridge in this context, whereas it is necessary in the context of the ASW table
          policyEngine.calculateBridge(axleConfig, [])
      : undefined,
  };
};
