import {
  getPermitCategoryName,
  PERMIT_CATEGORIES,
  PermitCategory,
} from "../types/PermitCategory";

import {
  NON_RESIDENT_PERMIT_LIST,
  PERMIT_TYPES,
  PermitType,
  TERM_PERMIT_LIST,
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

export const ALL_PERMIT_TYPE_CHOOSE_FROM_OPTIONS: PermitTypeChooseFromItem[] = [
  {
    value: PERMIT_CATEGORIES.TERM,
    label: getPermitCategoryName(PERMIT_CATEGORIES.TERM),
    items: TERM_PERMIT_LIST.map((permitType: PermitType) => ({
      value: permitType,
      label: getPermitTypeShortName(permitType),
    })),
  },
  {
    value: PERMIT_CATEGORIES.SINGLE_TRIP,
    label: getPermitCategoryName(PERMIT_CATEGORIES.SINGLE_TRIP),
    items: [
      {
        value: PERMIT_TYPES.STOS,
        label: getPermitTypeShortName(PERMIT_TYPES.STOS),
      },
    ],
    // items: SINGLE_TRIP_PERMIT_LIST.map((permitType: PermitType) => ({
    //   value: permitType,
    //   label: getPermitTypeShortName(permitType),
    // })),
  },
  {
    value: PERMIT_CATEGORIES.NON_RESIDENT,
    label: getPermitCategoryName(PERMIT_CATEGORIES.NON_RESIDENT),
    items: NON_RESIDENT_PERMIT_LIST.map((permitType: PermitType) => ({
      value: permitType,
      label: getPermitTypeShortName(permitType),
    })),
  },
  {
    value: PERMIT_TYPES.MFP,
    label: getPermitTypeShortName(PERMIT_TYPES.MFP),
  },
];

export interface PermitTypeChooseFromItem {
  value: PermitType | PermitCategory;
  label: string;
  items?: PermitTypeChooseFromItem[];
  category?: string;
}

export const BASE_DAYS_IN_YEAR = 365;
export const TERM_PERMIT_MIN_DURATION = 30;
export const TERM_DURATION_INTERVAL_DAYS = 30;
export const MAX_ALLOWED_FUTURE_DAYS_CV = 14;
export const MAX_ALLOWED_FUTURE_DAYS_STAFF = 60;

export const TERM_PERMIT_DURATION_OPTIONS = [
  { value: TERM_PERMIT_MIN_DURATION, label: "30 Days" },
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

export const LCV_VEHICLE_SUBTYPES = [
  {
    typeCode: "LCVRMDB",
    type: "Long Combination Vehicles (LCV) - Rocky Mountain Doubles",
    description: "LCV vehicles for approved carriers and routes only."
  },
  {
    typeCode: "LCVTPDB",
    type: "Long Combination Vehicles (LCV) - Turnpike Doubles",
    description: "LCV vehicles for approved carriers and routes only."
  },
];

export const CONDITIONAL_LICENSING_FEE_LINKS = {
  CONDITIONAL_LICENSING_FEE_RATE: {
    LINK_TEXT: "Commercial Transport Fees Regulation Item 3(b)",
    URL: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/328_91",
  },
  INDUSTRIAL_X_PLATE_TYPE_FEE_RATE: {
    LINK_TEXT: "Commercial Transport Fees Regulation Item 2(c)",
    URL: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/328_91",
  },
  FARM_VEHICLE_FEE_RATE: {
    LINK_TEXT: "Commercial Transport Fees Regulation Item 2(d)",
    URL: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/328_91",
  },
  FARM_TRACTOR_FEE_RATE: {
    LINK_TEXT: "Commercial Transport Fees Regulation Item 2(b)",
    URL: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/328_91",
  },
  COMMERCIAL_PASSENGER_VEHICLE_FEE_RATE: {
    LINK_TEXT: "Commercial Transport Fees Regulation 2 (a.2)",
    URL: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/328_91",
  },
};
