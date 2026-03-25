import { PermitCondition } from "../types/PermitCondition";

export const STOS_CONDITIONS: PermitCondition[] = [
  {
    description: "General Permit Conditions",
    condition: "CVSE-1000",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
    checked: true,
    disabled: true
  },
  {
    description: "Permit Scope and Limitation",
    condition: "CVSE-1070",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
    checked: true,
    disabled: true
  },
  {
    description: "Routes Pre-Approved for 5.0 m OAW",
    condition: "CVSE-1001",
    conditionLink: "",
    checked: false
  },
  {
    description: "General Permit Conditions to 6.1 m in the Peace River Area",
    condition: "CVSE-1002",
    conditionLink: "",
    checked: false
  },
  {
    description: "East-West Overheight Corridors in the Lower Mainland",
    condition: "CVSE-1010",
    conditionLink: "",
    checked: false
  },
  {
    description: "Routes - Woods Chips & Residual",
    condition: "CVSE-1012",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259",
    checked: false
  },
  {
    description: "Restricted Routes for Hauling Wood on Wide Bunks",
    condition: "CVSE-1013",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254",
    checked: false
  },
  {
    description: "Structure Permit Conditions",
    condition: "CVSE-1000S",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255",
    checked: false
  },
  {
    description: "Log Permit Conditions",
    condition: "CVSE-1000L",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250",
    checked: false
  },
];

export const MANDATORY_STOS_CONDITIONS: PermitCondition[] =
  STOS_CONDITIONS.filter(
    ({ condition }: PermitCondition) =>
      condition === "CVSE-1000" || condition === "CVSE-1070"
  );

export const MIN_STOS_DURATION = 1;
export const MAX_STOS_CV_DURATION = 7;
export const MAX_STOS_STAFF_DURATION = 30;
export const STOS_CV_DURATION_OPTIONS = [
  { value: MIN_STOS_DURATION, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
  { value: 4, label: "4 Days" },
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: MAX_STOS_CV_DURATION, label: "7 Days" },
];

export const STOS_STAFF_DURATION_OPTIONS = [
  { value: MIN_STOS_DURATION, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
  { value: 4, label: "4 Days" },
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: 7, label: "7 Days" },
  { value: 8, label: "8 Days" },
  { value: 9, label: "9 Days" },
  { value: 10, label: "10 Days" },
  { value: 11, label: "11 Days" },
  { value: 12, label: "12 Days" },
  { value: 13, label: "13 Days" },
  { value: 14, label: "14 Days" },
  { value: 15, label: "15 Days" },
  { value: 16, label: "16 Days" },
  { value: 17, label: "17 Days" },
  { value: 18, label: "18 Days" },
  { value: 19, label: "19 Days" },
  { value: 20, label: "20 Days" },
  { value: 21, label: "21 Days" },
  { value: 22, label: "22 Days" },
  { value: 23, label: "23 Days" },
  { value: 24, label: "24 Days" },
  { value: 25, label: "25 Days" },
  { value: 26, label: "26 Days" },
  { value: 27, label: "27 Days" },
  { value: 28, label: "28 Days" },
  { value: 29, label: "29 Days" },
  { value: MAX_STOS_STAFF_DURATION, label: "30 Days" },
];

export const STOS_DURATION_INTERVAL_DAYS = 1;
