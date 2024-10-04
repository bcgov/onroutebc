/* eslint-disable @typescript-eslint/no-unused-vars */
import { VEHICLE_TYPES } from "../../manageVehicles/types/Vehicle";
import {
  getPermitCategoryName,
  PERMIT_CATEGORIES,
} from "../types/PermitCategory";
import {
  EMPTY_PERMIT_TYPE_SELECT,
  PERMIT_TYPES,
  getPermitTypeName,
  getPermitTypeShortName,
} from "../types/PermitType";

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

const TERM_PERMIT_CHOOSE_FROM_OPTIONS: PermitTypeChooseFromItem[] = [
  {
    value: PERMIT_TYPES.TROS,
    label: getPermitTypeShortName(PERMIT_TYPES.TROS),
  },
  {
    value: PERMIT_TYPES.TROW,
    label: getPermitTypeShortName(PERMIT_TYPES.TROW),
  },
  {
    value: PERMIT_TYPES.HC,
    label: getPermitTypeShortName(PERMIT_TYPES.HC),
  },
];

const SINGLE_TRIP_PERMIT_CHOOSE_FROM_OPTIONS: PermitTypeChooseFromItem[] = [
  {
    value: PERMIT_TYPES.STOS,
    label: getPermitTypeShortName(PERMIT_TYPES.STOS),
  },
  {
    value: PERMIT_TYPES.STOW,
    label: getPermitTypeShortName(PERMIT_TYPES.STOW),
  },
  {
    value: PERMIT_TYPES.STWS,
    label: getPermitTypeShortName(PERMIT_TYPES.STWS),
  },
  {
    value: PERMIT_TYPES.EPTOP,
    label: getPermitTypeShortName(PERMIT_TYPES.EPTOP),
  },
  {
    value: PERMIT_TYPES.STOL,
    label: getPermitTypeShortName(PERMIT_TYPES.STOL),
  },
];

export const PERMIT_CATERGORY_CHOOSE_FROM_OPTIONS: PermitTypeChooseFromItem[] =
  [
    {
      value: PERMIT_CATEGORIES.TERM,
      label: getPermitCategoryName(PERMIT_CATEGORIES.TERM),
      items: TERM_PERMIT_CHOOSE_FROM_OPTIONS,
    },
    {
      value: PERMIT_CATEGORIES.TRIP,
      label: getPermitCategoryName(PERMIT_CATEGORIES.TRIP),
      items: SINGLE_TRIP_PERMIT_CHOOSE_FROM_OPTIONS,
    },
    {
      value: PERMIT_CATEGORIES.NRES,
      label: getPermitCategoryName(PERMIT_CATEGORIES.NRES),
    },
    {
      value: PERMIT_CATEGORIES.MFUP,
      label: getPermitCategoryName(PERMIT_CATEGORIES.MFUP),
    },
  ];

export const PERMIT_TYPE_CHOOSE_FROM_OPTIONS = [
  { value: EMPTY_PERMIT_TYPE_SELECT, label: "Select" },
  { value: PERMIT_TYPES.TROS, label: getPermitTypeName(PERMIT_TYPES.TROS) },
  { value: PERMIT_TYPES.TROW, label: getPermitTypeName(PERMIT_TYPES.TROW) },
];

export interface PermitTypeChooseFromItem {
  value: string;
  label: string;
  items?: PermitTypeChooseFromItem[];
}

export const BASE_DAYS_IN_YEAR = 365;
export const COMMON_MIN_DURATION = 30;
export const TERM_DURATION_INTERVAL_DAYS = 30;

export const COMMON_DURATION_OPTIONS = [
  { value: COMMON_MIN_DURATION, label: "30 Days" },
  { value: 60, label: "60 Days" },
  { value: 90, label: "90 Days" },
  { value: 120, label: "120 Days" },
  { value: 150, label: "150 Days" },
  { value: 180, label: "180 Days" },
  { value: 210, label: "210 Days" },
  { value: 240, label: "240 Days" },
  { value: 270, label: "270 Days" },
  { value: 300, label: "300 Days" },
  { value: 330, label: "330 Days" },
  { value: BASE_DAYS_IN_YEAR, label: "1 Year" },
];

export const LCV_CONDITION = {
  description: "LCV Operating Conditions & Routes",
  condition: "CVSE-1014",
  conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1260",
  checked: true,
  disabled: true,
};
