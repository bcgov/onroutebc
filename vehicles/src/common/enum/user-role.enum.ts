export enum ClientUserRole {
  PERMIT_APPLICANT = 'PAPPLICANT',
  COMPANY_ADMINISTRATOR = 'ORGADMIN',
}

export enum IDIRUserRole {
  PPC_CLERK = 'PPCCLERK',
  // PPC SUPERVISOR aka CTPO
  CTPO = 'CTPO',
  SYSTEM_ADMINISTRATOR = 'SYSADMIN',
  ENFORCEMENT_OFFICER = 'EOFFICER',
  HQ_ADMINISTRATOR = 'HQADMIN',
  FINANCE = 'FINANCE',
}

export enum GenericUserRole {
  ANONYMOUS = 'ANONYMOUS',
  PUBLIC_VERIFIED = 'PUBLIC',
}

export type UserRole = ClientUserRole | IDIRUserRole | GenericUserRole;

export const GENERIC_USER_ROLE_LIST: readonly GenericUserRole[] =
  Object.values(GenericUserRole);

export const CLIENT_USER_ROLE_LIST: readonly ClientUserRole[] =
  Object.values(ClientUserRole);

export const IDIR_USER_ROLE_LIST: readonly IDIRUserRole[] =
  Object.values(IDIRUserRole);
