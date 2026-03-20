import { PermitCondition } from "../types/PermitCondition";

export const NRQCV_CONDITIONS: PermitCondition[] = [
  {
    description: "Insurance Certificate Conditions",
    condition: "CVSE-1070",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
    checked: true,
    disabled: true
  },
];

export const MANDATORY_NRQCV_CONDITIONS: PermitCondition[] = [...NRQCV_CONDITIONS];
