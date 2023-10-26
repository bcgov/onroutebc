import { PERMIT_TYPES, getPermitTypeName } from "../types/PermitType";

export const CHOOSE_FROM_OPTIONS = [
  { value: "unitNumber", label: "Unit Number" },
  { value: "plate", label: "Plate" },
];

export const VEHICLE_TYPES = [
  { value: "powerUnit", label: "Power Unit" },
  { value: "trailer", label: "Trailer" },
];

export const PERMIT_TYPE_CHOOSE_FROM_OPTIONS = [
  { value: "select", label: "Select" },
  { value: PERMIT_TYPES.TROS, label: getPermitTypeName(PERMIT_TYPES.TROS) },
];
