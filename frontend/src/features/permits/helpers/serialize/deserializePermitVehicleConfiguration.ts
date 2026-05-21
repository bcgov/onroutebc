import { Nullable, RequiredOrNull } from "../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../types/PermitVehicleConfiguration";
import {
  convertCentimetreValuesToMetres,
  unmergeInteraxleSpacingRows,
} from "../axleUnitHelper";

/**
 * Deserialize permit vehicle configuration values from API payload.
 * @param vehicleConfiguration Permit vehicle configuration
 * @returns Deserialized permit vehicle configuration values
 */
export const deserializePermitVehicleConfiguration = (
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>,
): RequiredOrNull<PermitVehicleConfiguration> => {
  return vehicleConfiguration
    ? {
        ...vehicleConfiguration,
        axleConfiguration: vehicleConfiguration.axleConfiguration
          ? unmergeInteraxleSpacingRows(
              [...vehicleConfiguration.axleConfiguration],
              1,
            ).map(convertCentimetreValuesToMetres)
          : null,
        trailers: vehicleConfiguration.trailers
          ? vehicleConfiguration.trailers.map((trailer) => ({
              ...trailer,
              axleConfiguration: trailer.axleConfiguration
                ? unmergeInteraxleSpacingRows(
                    [...trailer.axleConfiguration],
                    0,
                  ).map(convertCentimetreValuesToMetres)
                : null,
            }))
          : null,
      }
    : null;
};
