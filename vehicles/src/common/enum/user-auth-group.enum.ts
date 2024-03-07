export enum UserAuthGroup {
  ANONYMOUS = 'ANONYMOUS',
  CV_CLIENT = 'CVCLIENT',
  COMPANY_ADMINISTRATOR = 'ORGADMIN',
  PPC_CLERK = 'PPCCLERK',
  PPC_SUPERVISOR = 'CTPO',
  PUBLIC_VERIFIED = 'PUBLIC',
  SYSTEM_ADMINISTRATOR = 'SYSADMIN',
  ENFORCEMENT_OFFICER = 'EOFFICER',
  HQ_ADMINISTRATOR = 'HQADMIN',
  FINANCE = 'FINANCE',
}

export const clientUserAuthGroupList: readonly UserAuthGroup[] = [
  UserAuthGroup.CV_CLIENT,
  UserAuthGroup.COMPANY_ADMINISTRATOR,
];

export enum ClientUserAuthGroup {
  CV_CLIENT = 'CVCLIENT',
  COMPANY_ADMINISTRATOR = 'ORGADMIN',
}

export const idirUserAuthGroupList: readonly UserAuthGroup[] = [
  UserAuthGroup.PPC_CLERK,
  UserAuthGroup.PPC_SUPERVISOR,
  UserAuthGroup.SYSTEM_ADMINISTRATOR,
  UserAuthGroup.ENFORCEMENT_OFFICER,
  UserAuthGroup.HQ_ADMINISTRATOR,
  UserAuthGroup.FINANCE,
];

export enum IDIRUserAuthGroup {
  PPC_CLERK = 'PPCCLERK',
  PPC_SUPERVISOR = 'CTPO',
  SYSTEM_ADMINISTRATOR = 'SYSADMIN',
  ENFORCEMENT_OFFICER = 'EOFFICER',
  HQ_ADMINISTRATOR = 'HQADMIN',
  FINANCE = 'FINANCE',
}
