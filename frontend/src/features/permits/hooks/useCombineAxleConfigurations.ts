import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { VehicleInConfiguration as VehicleInConfigurationPE } from "onroute-policy-engine/types";
import { VehicleInConfiguration } from "../types/PermitVehicleConfiguration";
import { AxleConfiguration } from "../types/AxleUnit";

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
            trailers as VehicleInConfigurationPE[],
          )
      : undefined,
  };
};
