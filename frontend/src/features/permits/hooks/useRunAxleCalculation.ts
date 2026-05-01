import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { AxleConfiguration } from "../../../common/types/AxleUnit";
import { PermitVehicleConfiguration } from "../types/PermitVehicleConfiguration";
import { getDefaultVehicleConfiguration } from "../helpers/vehicles/configuration/getDefaultVehicleConfiguration";
import { PermitType } from "../types/PermitType";
import { VehicleConfiguration } from "onroute-policy-engine/types";

export const useRunAxleCalculation = (policyEngine: Nullable<Policy>) => {
  return {
    runAxleCalculation: policyEngine
      ? (
          permitType: PermitType,
          vehicleDetails: PermitVehicleDetails,
          vehicleConfiguration: PermitVehicleConfiguration,
          axleConfiguration: AxleConfiguration[],
          licensedGVW: number,
        ) => {
          const { getSimplifiedVehicleConfiguration } = policyEngine;
          const serializedVehicleConfiguration = getDefaultVehicleConfiguration(
            permitType,
            vehicleConfiguration,
          );

          const results = policyEngine.runAxleCalculation(
            getSimplifiedVehicleConfiguration(
              vehicleDetails,
              serializedVehicleConfiguration as VehicleConfiguration,
            ),
            axleConfiguration,
            licensedGVW,
          );
          return results.results;
        }
      : undefined,
  };
};
