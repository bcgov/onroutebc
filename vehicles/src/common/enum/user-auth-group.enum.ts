export enum ClientUserAuthGroup {
  PERMIT_APPLICANT = 'PAPPLICANT',
  COMPANY_ADMINISTRATOR = 'ORGADMIN',
}

export enum IDIRUserAuthGroup {
  PPC_CLERK = 'PPCCLERK',
  PPC_SUPERVISOR = 'CTPO',
  SYSTEM_ADMINISTRATOR = 'SYSADMIN',
  ENFORCEMENT_OFFICER = 'EOFFICER',
  HQ_ADMINISTRATOR = 'HQADMIN',
  FINANCE = 'FINANCE',
}

export enum GenericUserAuthGroup {
  ANONYMOUS = 'ANONYMOUS',
  PUBLIC_VERIFIED = 'PUBLIC',
}

export type UserAuthGroup =
  | ClientUserAuthGroup
  | IDIRUserAuthGroup
  | GenericUserAuthGroup;

export const GENERIC_USER_AUTH_GROUP_LIST: readonly GenericUserAuthGroup[] =
  Object.values(GenericUserAuthGroup);

export const CLIENT_USER_AUTH_GROUP_LIST: readonly ClientUserAuthGroup[] =
  Object.values(ClientUserAuthGroup);

export const IDIR_USER_AUTH_GROUP_LIST: readonly IDIRUserAuthGroup[] =
  Object.values(IDIRUserAuthGroup);
