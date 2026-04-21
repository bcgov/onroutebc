import { DEFAULT_AXLE_UNIT } from "../../../../../common/constants/defaultAxleUnit";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { Nullable } from "../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../types/PermitType";
import { PermitVehicleConfiguration } from "../../../types/PermitVehicleConfiguration";

export const getDefaultVehicleConfiguration = (
  permitType: PermitType,
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>,
) => {
  const defaultPowerUnitAxleConfiguration = [
    DEFAULT_AXLE_UNIT,
    { interaxleSpacing: null },
    DEFAULT_AXLE_UNIT,
  ];

  if (
    !(
      [
        PERMIT_TYPES.STOS,
        PERMIT_TYPES.STOW,
        PERMIT_TYPES.NRQCV,
        PERMIT_TYPES.NRSCV,
      ] as PermitType[]
    ).includes(permitType)
  )
    return null;

  if (permitType === PERMIT_TYPES.STOS) {
    return {
      frontProjection: getDefaultRequiredVal(
        null,
        vehicleConfiguration?.frontProjection,
      ),
      rearProjection: getDefaultRequiredVal(
        null,
        vehicleConfiguration?.rearProjection,
      ),
      overallWidth: getDefaultRequiredVal(
        null,
        vehicleConfiguration?.overallWidth,
      ),
      overallHeight: getDefaultRequiredVal(
        null,
        vehicleConfiguration?.overallHeight,
      ),
      overallLength: getDefaultRequiredVal(
        null,
        vehicleConfiguration?.overallLength,
      ),
      axleConfiguration: getDefaultRequiredVal(
        defaultPowerUnitAxleConfiguration,
        vehicleConfiguration?.axleConfiguration,
      ),
      trailers: getDefaultRequiredVal([], vehicleConfiguration?.trailers),
    };
  }

  if (permitType === PERMIT_TYPES.STOW) {
    return {
      // by default, all power units have 2 axle units (1 axle unit with 1 axle, followed by an interaxle-spacing unit, followed by another axle unit with 1 axle)
      axleConfiguration: getDefaultRequiredVal(
        defaultPowerUnitAxleConfiguration,
        vehicleConfiguration?.axleConfiguration,
      ),
      trailers: getDefaultRequiredVal([], vehicleConfiguration?.trailers),
    };
  }
  return {
    loadedGVW: getDefaultRequiredVal(null, vehicleConfiguration?.loadedGVW),
    netWeight: getDefaultRequiredVal(null, vehicleConfiguration?.netWeight),
  };
};
