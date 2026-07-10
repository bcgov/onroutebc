import { Policy } from "onroute-policy-engine";
import { Nullable } from "../../../common/types/common";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { PermitVehicleConfiguration } from "../types/PermitVehicleConfiguration";
import { getDefaultVehicleConfiguration } from "../helpers/vehicles/configuration/getDefaultVehicleConfiguration";
import { PermitType } from "../types/PermitType";
import { VehicleConfiguration } from "onroute-policy-engine/types";
import { AxleConfiguration } from "../types/AxleUnit";
import { AxleCalculationResult } from "../types/AxleCalculationResult";

export const useRunAxleCalculation = (policyEngine: Nullable<Policy>) => {
  return {
    runAxleCalculation: policyEngine
      ? (
          permitType: PermitType,
          vehicleDetails: PermitVehicleDetails,
          vehicleConfiguration: PermitVehicleConfiguration,
          axleConfiguration: AxleConfiguration[],
          licensedGVW: number,
        ): AxleCalculationResult => {
          const { getSimplifiedVehicleConfiguration } = policyEngine;
          const serializedVehicleConfiguration = getDefaultVehicleConfiguration(
            permitType,
            vehicleConfiguration,
          );

          const simplifiedVehicleConfiguration =
            getSimplifiedVehicleConfiguration(
              vehicleDetails,
              serializedVehicleConfiguration as VehicleConfiguration,
            );

          const results = policyEngine.runAxleCalculation(
            simplifiedVehicleConfiguration,
            axleConfiguration,
            licensedGVW,
          );

          console.log({
            simplifiedVehicleConfiguration,
            axleConfiguration,
            licensedGVW,
          });

          console.log(results);

          return results;
        }
      : undefined,
  };
};
