import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { PermitVehicleConfiguration } from "../types/PermitVehicleConfiguration";
import { getDefaultVehicleConfiguration } from "../helpers/vehicles/configuration/getDefaultVehicleConfiguration";
import { PermitType } from "../types/PermitType";
import { AxleConfiguration } from "onroute-policy-engine/types";

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

          const simplifiedVehicleConfiguration =
            getSimplifiedVehicleConfiguration(
              vehicleDetails,
              serializedVehicleConfiguration,
            );

          const results = policyEngine.runAxleCalculation(
            simplifiedVehicleConfiguration,
            axleConfiguration,
            licensedGVW,
          );
          return results;
        }
      : undefined,
  };
};
