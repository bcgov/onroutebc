import { VEHICLE_TYPES } from "../../manageVehicles/types/Vehicle";
import { PERMIT_TYPES, getPermitTypeName } from "../types/PermitType";

export const VEHICLE_CHOOSE_FROM = {
  UNIT_NUMBER: "unitNumber",
  PLATE: "plate",
} as const;

export type VehicleChooseFrom =
  (typeof VEHICLE_CHOOSE_FROM)[keyof typeof VEHICLE_CHOOSE_FROM];

export const CHOOSE_FROM_OPTIONS = [
  { value: VEHICLE_CHOOSE_FROM.UNIT_NUMBER, label: "Unit Number" },
  { value: VEHICLE_CHOOSE_FROM.PLATE, label: "Plate" },
];

export const VEHICLE_TYPE_OPTIONS = [
  { value: VEHICLE_TYPES.POWER_UNIT, label: "Power Unit" },
  { value: VEHICLE_TYPES.TRAILER, label: "Trailer" },
];

export const PERMIT_TYPE_CHOOSE_FROM_OPTIONS = [
  { value: "select", label: "Select" },
  { value: PERMIT_TYPES.TROS, label: getPermitTypeName(PERMIT_TYPES.TROS) },
];
