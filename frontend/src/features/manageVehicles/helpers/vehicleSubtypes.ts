import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { LCV_VEHICLE_SUBTYPES } from "../../permits/constants/constants";
import { usePowerUnitSubTypesQuery } from "../hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../hooks/trailers";
import {
  BaseVehicle,
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  VehicleType,
} from "../types/Vehicle";

/**
 * Determine whether or not a vehicle subtype ic considered to be LCV.
 * @param subtype Vehicle subtype
 * @returns If the subtype is considered to be LCV vehicle subtype
 */
export const isVehicleSubtypeLCV = (subtype: string) => {
  return LCV_VEHICLE_SUBTYPES.map(({ typeCode }) => typeCode).includes(subtype);
};

export const EMPTY_VEHICLE_SUBTYPE = {
  typeCode: "",
  type: "",
  description: "",
};

export const selectedVehicleSubtype = (vehicle: BaseVehicle) => {
  switch (vehicle.vehicleType) {
    case VEHICLE_TYPES.POWER_UNIT:
      return (vehicle as PowerUnit).powerUnitTypeCode;
    case VEHICLE_TYPES.TRAILER:
      return (vehicle as Trailer).trailerTypeCode;
    default:
      return "";
  }
};

export const transformVehicleCodeToSubtype = (
  vehicleType: VehicleType,
  code: string,
) => {
  const { data: powerUnitSubtypesData } = usePowerUnitSubTypesQuery();
  const { data: trailerSubtypesData } = useTrailerSubTypesQuery();
  const powerUnitSubTypes = getDefaultRequiredVal([], powerUnitSubtypesData);
  const trailerSubTypes = getDefaultRequiredVal([], trailerSubtypesData);

  const vehicleSubtypesForCode =
    vehicleType === VEHICLE_TYPES.POWER_UNIT
      ? powerUnitSubTypes.filter((value) => value.typeCode === code)
      : trailerSubTypes.filter((value) => value.typeCode === code);
  return getDefaultRequiredVal("", vehicleSubtypesForCode?.at(0)?.type);
};
