import {
  convertMetreValuesToCentimetres,
  mergeInteraxleSpacing,
} from "../../../../common/helpers/axleUnitHelper";
import { convertToNumberIfValid } from "../../../../common/helpers/numeric/convertToNumberIfValid";
import { Nullable, RequiredOrNull } from "../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../types/PermitVehicleConfiguration";

/**
 * Serialize permit vehicle configuration values as request payload.
 * @param vehicleConfiguration Permit vehicle configuration
 * @returns Serialized permit vehicle configuration values
 */
export const serializePermitVehicleConfiguration = (
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>,
): RequiredOrNull<PermitVehicleConfiguration> => {
  return vehicleConfiguration
    ? {
        trailers: vehicleConfiguration.trailers
          ? vehicleConfiguration.trailers.map((trailer) => ({
              ...trailer,
              axleConfiguration: trailer.axleConfiguration
                ? mergeInteraxleSpacing(
                    trailer.axleConfiguration.map(
                      convertMetreValuesToCentimetres,
                    ),
                    0,
                  )
                : null,
            }))
          : null,
        frontProjection: convertToNumberIfValid(
          vehicleConfiguration.frontProjection,
          null,
        ),
        rearProjection: convertToNumberIfValid(
          vehicleConfiguration.rearProjection,
          null,
        ),
        overallWidth: convertToNumberIfValid(
          vehicleConfiguration.overallWidth,
          null,
        ),
        overallHeight: convertToNumberIfValid(
          vehicleConfiguration.overallHeight,
          null,
        ),
        overallLength: convertToNumberIfValid(
          vehicleConfiguration.overallLength,
          null,
        ),
        loadedGVW: convertToNumberIfValid(vehicleConfiguration.loadedGVW, null),
        netWeight: convertToNumberIfValid(vehicleConfiguration.netWeight, null),
        // TODO ensure that values recorded in metres are converted to centimetres and then converted back to metres
        axleConfiguration: vehicleConfiguration.axleConfiguration
          ? mergeInteraxleSpacing(
              vehicleConfiguration.axleConfiguration.map(
                convertMetreValuesToCentimetres,
              ),
              1,
            )
          : null,
      }
    : null;
};
