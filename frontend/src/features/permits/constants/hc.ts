import { PermitCondition } from "../types/PermitCondition";

export const HC_CONDITIONS: PermitCondition[] = [
  {
    description: "Insurance Certificate Conditions",
    condition: "CVSE-1070",
    conditionLink: "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
    checked: true,
    disabled: true
  },
];

export const MANDATORY_HC_CONDITIONS: PermitCondition[] = [...HC_CONDITIONS];
export const MAX_HC_ALLOWED_FUTURE_DAYS = 90;
export const MAX_HC_ALLOWED_PAST_DAYS = 60;
