import { Commodities } from "../types/application";

export const TROS_PERMIT_DURATIONS = [
  { value: 30, label: "30 Days" },
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
  { value: 365, label: "1 Year" },
];

export const TROS_COMMODITIES: Commodities[] = [
  {
    description: "General Permit Conditions",
    condition: "CVSE-1000",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
    checked: true,
    disabled: true,
  },
  {
    description: "Permit Scope and Limitation",
    condition: "CVSE-1070",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
    checked: true,
    disabled: true,
  },
  {
    description: "Supplement for Structures",
    condition: "CVSE-1000S",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255",
    checked: false,
  },
  {
    description: "Log Permit Conditions",
    condition: "CVSE-1000L",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250",
    checked: false,
  },
  {
    description: "Routes - Woods Chips & Residual",
    condition: "CVSE-1012",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259",
    checked: false,
  },
  {
    description: "Restricted Routes for Hauling Wood on Wide Bunks",
    condition: "CVSE-1013",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254",
    checked: false,
  },
  {
    description: "Hay",
    condition: "HAY (hay bales)",
    conditionLink:
      "https://www.cvse.ca/ctpm/com_circulars/2012/120803_comp_cc_0912_changes_hay_bales.pdf",
    checked: false,
  },
  {
    description: "Stinger Steered Transport",
    condition: "SST (Stinger Steered Transporters)",
    conditionLink:
      "https://www.cvse.ca/CTPM/Com_Circulars/2017/171227-comp-cc_08-2107-Stinger-Steered-Car-Carrier.pdf",
    checked: false,
  },
];
