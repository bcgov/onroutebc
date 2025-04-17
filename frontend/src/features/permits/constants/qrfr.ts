import { PermitCondition } from "../types/PermitCondition";

export const QRFR_CONDITIONS: PermitCondition[] = [
  {
    description: "Insurance Certificate Conditions",
    condition: "APV96",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1547",
    checked: true,
    disabled: true
  },
];

export const MANDATORY_QRFR_CONDITIONS: PermitCondition[] = [...QRFR_CONDITIONS];
