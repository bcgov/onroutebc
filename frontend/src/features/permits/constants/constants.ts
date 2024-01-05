import { VEHICLE_TYPES } from "../../manageVehicles/types/Vehicle";
import { PERMIT_TYPES, getPermitTypeName } from "../types/PermitType";

export const CHOOSE_FROM_OPTIONS = [
  { value: "unitNumber", label: "Unit Number" },
  { value: "plate", label: "Plate" },
];

export const VEHICLE_TYPE_OPTIONS = [
  { value: VEHICLE_TYPES.POWER_UNIT, label: "Power Unit" },
  { value: VEHICLE_TYPES.TRAILER, label: "Trailer" },
];

export const PERMIT_TYPE_CHOOSE_FROM_OPTIONS = [
  { value: "select", label: "Select" },
  { value: PERMIT_TYPES.TROS, label: getPermitTypeName(PERMIT_TYPES.TROS) },
];
