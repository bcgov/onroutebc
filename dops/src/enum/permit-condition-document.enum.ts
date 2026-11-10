import { ExternalDocument } from './external-document.enum';

export const PermitConditionDocument = {
  ...ExternalDocument,
  EPTOP_ADDT_CONDT: 'EPTOP-ADDT-CONDT',
} as const;

export type PermitConditionDocument =
  (typeof PermitConditionDocument)[keyof typeof PermitConditionDocument];
