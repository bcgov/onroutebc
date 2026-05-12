import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import {
  AxleConfiguration,
  VehicleInConfiguration,
} from "onroute-policy-engine/types";

export const useCombineAxleConfigurations = (
  policyEngine: Nullable<Policy>,
) => {
  return {
    combineAxleConfigurations: policyEngine
      ? (
          powerUnitAxleConfiguration: AxleConfiguration[],
          trailers: VehicleInConfiguration[],
        ) =>
          policyEngine.combineAxleConfigurations(
            powerUnitAxleConfiguration,
            trailers,
          )
      : undefined,
  };
};
