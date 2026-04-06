import { convertToNumberIfValid } from "../../../../common/helpers/numeric/convertToNumberIfValid";
import { AxleUnit } from "../../../../common/types/AxleUnit";
import { Nullable, RequiredOrNull } from "../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../types/PermitVehicleConfiguration";

/** Removes individual interaxle spacing rows and merges their value into the next axleConfiguration object */
const mergeInteraxleSpacingRows = (
  axleConfiguration: AxleUnit[],
  startIndex: number,
) => {
  const merged = [...axleConfiguration];
  for (let i = startIndex; i < merged.length - 1; i++) {
    merged[i + 1].interaxleSpacing = merged[i].interaxleSpacing;
    merged.splice(i, 1);
  }

  return merged;
};

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
                ? mergeInteraxleSpacingRows([...trailer.axleConfiguration], 0)
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
        axleConfiguration: vehicleConfiguration.axleConfiguration
          ? mergeInteraxleSpacingRows(
              [...vehicleConfiguration.axleConfiguration],
              1,
            )
          : null,
      }
    : null;
};
