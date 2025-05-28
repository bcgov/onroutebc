import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { Nullable } from "../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../types/PermitType";
import { PermitVehicleConfiguration } from "../../../types/PermitVehicleConfiguration";

export const getDefaultVehicleConfiguration = (
  permitType: PermitType,
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>,
) => {
  if (!([
    PERMIT_TYPES.STOS,
    PERMIT_TYPES.NRQCV,
    PERMIT_TYPES.NRSCV,
  ] as PermitType[]).includes(permitType)) return null;

  if (permitType === PERMIT_TYPES.STOS) {
    return {
      frontProjection: getDefaultRequiredVal(null, vehicleConfiguration?.frontProjection),
      rearProjection: getDefaultRequiredVal(null, vehicleConfiguration?.rearProjection),
      overallWidth: getDefaultRequiredVal(null, vehicleConfiguration?.overallWidth),
      overallHeight: getDefaultRequiredVal(null, vehicleConfiguration?.overallHeight),
      overallLength: getDefaultRequiredVal(null, vehicleConfiguration?.overallLength),
      trailers: getDefaultRequiredVal([], vehicleConfiguration?.trailers),
    };
  }

  return {
    loadedGVW: getDefaultRequiredVal(null, vehicleConfiguration?.loadedGVW),
    netWeight: getDefaultRequiredVal(null, vehicleConfiguration?.netWeight),
  };
};