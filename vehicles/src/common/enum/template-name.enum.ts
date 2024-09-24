import { ApplicationStatus } from './application-status.enum';
import { PermitType } from './permit-type.enum';

export enum TemplateName {
  PERMIT = 'PERMIT',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  PERMIT_VOID = 'PERMIT_VOID',
  PERMIT_REVOKED = 'PERMIT_REVOKED',
  PERMIT_STOS = 'PERMIT_STOS',
  PERMIT_STOS_VOID = 'PERMIT_STOS_VOID',
  PERMIT_STOS_REVOKED = 'PERMIT_STOS_REVOKED',
  PERMIT_TROS = 'PERMIT_TROS',
  PERMIT_TROS_VOID = 'PERMIT_TROS_VOID',
  PERMIT_TROS_REVOKED = 'PERMIT_TROS_REVOKED',
}

export type PermitTemplateMapping = {
  [K in ApplicationStatus]?: {
    [T in PermitType | 'default']?: TemplateName;
  };
};
