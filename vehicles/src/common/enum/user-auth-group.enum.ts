export enum ClientUserAuthGroup {
  PERMIT_APPLICANT = 'PAPPLICANT',
  COMPANY_ADMINISTRATOR = 'ORGADMIN',
}

export enum IDIRUserAuthGroup {
  PPC_CLERK = 'PPCCLERK',
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

export const GENERIC_USER_AUTH_GROUP_LIST: ReadonlyArray<GenericUserAuthGroup> =
  Object.values(GenericUserAuthGroup);

export const CLIENT_USER_AUTH_GROUP_LIST: ReadonlyArray<ClientUserAuthGroup> =
  Object.values(ClientUserAuthGroup);

export const IDIR_USER_AUTH_GROUP_LIST: ReadonlyArray<IDIRUserAuthGroup> =
  Object.values(IDIRUserAuthGroup);
