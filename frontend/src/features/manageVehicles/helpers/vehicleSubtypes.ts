import { Nullable } from "../../../common/types/common";
import { LCV_VEHICLE_SUBTYPES } from "../../permits/constants/constants";
import {
  DEFAULT_EMPTY_SELECT_OPTION,
  DEFAULT_EMPTY_SELECT_VALUE,
} from "../../../common/constants/constants";

import {
  BaseVehicle,
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  VehicleSubType,
} from "../types/Vehicle";

/**
 * Determine whether or not a vehicle subtype ic considered to be LCV.
 * @param subtype Vehicle subtype
 * @returns If the subtype is considered to be LCV vehicle subtype
 */
export const isVehicleSubtypeLCV = (subtype: string) => {
  return LCV_VEHICLE_SUBTYPES.map(({ typeCode }) => typeCode).includes(subtype);
};

export const EMPTY_VEHICLE_SUBTYPE: VehicleSubType = {
  typeCode: DEFAULT_EMPTY_SELECT_VALUE,
  type: DEFAULT_EMPTY_SELECT_OPTION.label,
  description: "",
};

export const isVehicleSubtypeEmpty = (subtype?: Nullable<string>) => {
  return !subtype || subtype === DEFAULT_EMPTY_SELECT_VALUE;
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

export const isTrailerSubtypeNone = (trailerSubtype: string) => {
  return ["NONEXXX", "XXXXXXX"].includes(trailerSubtype);
};
