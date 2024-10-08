import { IDP } from '../../../../src/common/enum/idp.enum';
import { Claim } from '../../../../src/common/enum/claims.enum';
import { IUserJWT } from '../../../../src/common/interface/user-jwt.interface';
import * as constants from './test-data.constants';

export const redCompanyAdminUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.RED_COMPANY_ADMIN_FULL_NAME,
  family_name: constants.RED_COMPANY_ADMIN_LAST_NAME,
  given_name: constants.RED_COMPANY_ADMIN_FIRST_NAME,
  display_name: constants.RED_COMPANY_ADMIN_FULL_NAME,
  email: constants.RED_COMPANY_ADMIN_EMAIL,
  identity_provider: IDP.BCEID,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.RED_COMPANY_ADMIN_PREFFERED_USER_NAME,
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: constants.RED_COMPANY_ADMIN_USER_NAME,
  bceid_user_guid: constants.RED_COMPANY_ADMIN_USER_GUID,
  bceid_business_guid: constants.RED_COMPANY_GUID,
  bceid_business_name: constants.RED_COMPANY_LEGAL_NAME,
  userName: constants.RED_COMPANY_ADMIN_USER_NAME,
  userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
  companyId: constants.RED_COMPANY_ID,
  claims: [
    //TOCHANGE
    Claim.PUBLIC_AGENT,
    Claim.PUBLIC_ORG_ADMIN,
    Claim.PUBLIC_USER_ADMIN,
    Claim.PUBLIC_VEHICLE_ADMIN,
    Claim.PUBLIC_VERIFIED,
    Claim.READ_BILLING,
    Claim.READ_ORG,
    Claim.READ_PERMIT,
    Claim.READ_SELF,
    Claim.READ_USER,
    Claim.READ_VEHICLE,
    Claim.STAFF,
    Claim.STAFF_ADMIN,
    Claim.STAFF_PERMIT_ISSUER,
    Claim.WRITE_BILLING,
    Claim.WRITE_ORG,
    Claim.WRITE_PERMIT,
    Claim.WRITE_SELF,
    Claim.WRITE_USER,
    Claim.WRITE_VEHICLE,
  ],
  associatedCompanies: [constants.RED_COMPANY_ID],
  access_token: undefined,
  orbcUserFirstName: constants.RED_COMPANY_ADMIN_FIRST_NAME,
  orbcUserLastName: constants.RED_COMPANY_ADMIN_LAST_NAME,
  orbcUserRole: constants.RED_COMPANY_ADMIN_ROLE_GROUP,
  orbcUserDirectory: constants.RED_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  clientId: null,
};

export const redCompanyCvClientUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.RED_COMPANY_CVCLIENT_FULL_NAME,
  family_name: constants.RED_COMPANY_CVCLIENT_LAST_NAME,
  given_name: constants.RED_COMPANY_CVCLIENT_FIRST_NAME,
  display_name: constants.RED_COMPANY_CVCLIENT_FULL_NAME,
  email: constants.RED_COMPANY_CVCLIENT_EMAIL,
  identity_provider: IDP.BCEID,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.RED_COMPANY_CVCLIENT_PREFFERED_USER_NAME,
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  bceid_user_guid: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  bceid_business_guid: undefined,
  bceid_business_name: undefined,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  companyId: constants.RED_COMPANY_ID,
  claims: [
    //TOCHANGE
    Claim.PUBLIC_AGENT,
    Claim.PUBLIC_ORG_ADMIN,
    Claim.PUBLIC_USER_ADMIN,
    Claim.PUBLIC_VEHICLE_ADMIN,
    Claim.PUBLIC_VERIFIED,
    Claim.READ_BILLING,
    Claim.READ_ORG,
    Claim.READ_PERMIT,
    Claim.READ_SELF,
    Claim.READ_USER,
    Claim.READ_VEHICLE,
    Claim.STAFF,
    Claim.STAFF_ADMIN,
    Claim.STAFF_PERMIT_ISSUER,
    Claim.WRITE_BILLING,
    Claim.WRITE_ORG,
    Claim.WRITE_PERMIT,
    Claim.WRITE_SELF,
    Claim.WRITE_USER,
    Claim.WRITE_VEHICLE,
  ],
  associatedCompanies: [constants.RED_COMPANY_ID],
  access_token: undefined,
  orbcUserFirstName: constants.RED_COMPANY_CVCLIENT_FIRST_NAME,
  orbcUserLastName: constants.RED_COMPANY_CVCLIENT_LAST_NAME,
  orbcUserRole: constants.RED_COMPANY_CVCLIENT_ROLE_GROUP,
  orbcUserDirectory: constants.RED_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  clientId: null,
};

export const redCompanyPendingUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.RED_COMPANY_PENDING_USER_FULL_NAME,
  family_name: constants.RED_COMPANY_PENDING_USER_LAST_NAME,
  given_name: constants.RED_COMPANY_PENDING_USER_FIRST_NAME,
  display_name: constants.RED_COMPANY_PENDING_USER_FULL_NAME,
  email: constants.RED_COMPANY_PENDING_USER_EMAIL,
  identity_provider: IDP.BCEID,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.RED_COMPANY_PENDING_USER_PREFFERED_USER_NAME,
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: constants.RED_COMPANY_PENDING_USER_NAME,
  bceid_user_guid: constants.RED_COMPANY_PENDING_USER_GUID,
  bceid_business_guid: constants.RED_COMPANY_GUID,
  bceid_business_name: constants.RED_COMPANY_LEGAL_NAME,
  userName: constants.RED_COMPANY_PENDING_USER_NAME,
  userGUID: constants.RED_COMPANY_PENDING_USER_GUID,
  companyId: constants.RED_COMPANY_ID,
  claims: [],
  associatedCompanies: [constants.RED_COMPANY_ID],
  access_token: undefined,
  orbcUserFirstName: undefined,
  orbcUserLastName: undefined,
  orbcUserRole: undefined,
  orbcUserDirectory: undefined,
  clientId: null,
};

export const blueCompanyAdminUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.BLUE_COMPANY_ADMIN_FULL_NAME,
  family_name: constants.BLUE_COMPANY_ADMIN_LAST_NAME,
  given_name: constants.BLUE_COMPANY_ADMIN_FIRST_NAME,
  display_name: constants.BLUE_COMPANY_ADMIN_FULL_NAME,
  email: constants.BLUE_COMPANY_ADMIN_EMAIL,
  identity_provider: IDP.BCEID,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.BLUE_COMPANY_ADMIN_PREFFERED_USER_NAME,
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  bceid_user_guid: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  bceid_business_guid: undefined,
  bceid_business_name: undefined,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  companyId: constants.BLUE_COMPANY_ID,
  claims: [
    //TOCHANGE
    Claim.PUBLIC_AGENT,
    Claim.PUBLIC_ORG_ADMIN,
    Claim.PUBLIC_USER_ADMIN,
    Claim.PUBLIC_VEHICLE_ADMIN,
    Claim.PUBLIC_VERIFIED,
    Claim.READ_BILLING,
    Claim.READ_ORG,
    Claim.READ_PERMIT,
    Claim.READ_SELF,
    Claim.READ_USER,
    Claim.READ_VEHICLE,
    Claim.STAFF,
    Claim.STAFF_ADMIN,
    Claim.STAFF_PERMIT_ISSUER,
    Claim.WRITE_BILLING,
    Claim.WRITE_ORG,
    Claim.WRITE_PERMIT,
    Claim.WRITE_SELF,
    Claim.WRITE_USER,
    Claim.WRITE_VEHICLE,
  ],
  associatedCompanies: [constants.BLUE_COMPANY_ID],
  access_token: undefined,
  orbcUserFirstName: constants.BLUE_COMPANY_ADMIN_FIRST_NAME,
  orbcUserLastName: constants.BLUE_COMPANY_ADMIN_LAST_NAME,
  orbcUserRole: constants.BLUE_COMPANY_ADMIN_USER_ROLE,
  orbcUserDirectory: constants.BLUE_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  clientId: null,
};

export const blueCompanyCvClientUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.BLUE_COMPANY_CVCLIENT_FULL_NAME,
  family_name: constants.BLUE_COMPANY_CVCLIENT_LAST_NAME,
  given_name: constants.BLUE_COMPANY_CVCLIENT_FIRST_NAME,
  display_name: constants.BLUE_COMPANY_CVCLIENT_FULL_NAME,
  email: constants.BLUE_COMPANY_CVCLIENT_EMAIL,
  identity_provider: IDP.BCEID,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.BLUE_COMPANY_CVCLIENT_PREFFERED_USER_NAME,
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  bceid_user_guid: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  bceid_business_guid: undefined,
  bceid_business_name: undefined,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  companyId: constants.BLUE_COMPANY_ID,
  claims: [
    //TOCHANGE
    Claim.PUBLIC_AGENT,
    Claim.PUBLIC_ORG_ADMIN,
    Claim.PUBLIC_USER_ADMIN,
    Claim.PUBLIC_VEHICLE_ADMIN,
    Claim.PUBLIC_VERIFIED,
    Claim.READ_BILLING,
    Claim.READ_ORG,
    Claim.READ_PERMIT,
    Claim.READ_SELF,
    Claim.READ_USER,
    Claim.READ_VEHICLE,
    Claim.STAFF,
    Claim.STAFF_ADMIN,
    Claim.STAFF_PERMIT_ISSUER,
    Claim.WRITE_BILLING,
    Claim.WRITE_ORG,
    Claim.WRITE_PERMIT,
    Claim.WRITE_SELF,
    Claim.WRITE_USER,
    Claim.WRITE_VEHICLE,
  ],
  associatedCompanies: [constants.BLUE_COMPANY_ID],
  access_token: undefined,
  orbcUserFirstName: constants.BLUE_COMPANY_CVCLIENT_FIRST_NAME,
  orbcUserLastName: constants.BLUE_COMPANY_CVCLIENT_LAST_NAME,
  orbcUserRole: constants.BLUE_COMPANY_CVCLIENT_USER_ROLE,
  orbcUserDirectory: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  clientId: null,
};

export const sysAdminStaffUserJWTMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: constants.SYS_ADMIN_STAFF_FULL_NAME,
  family_name: constants.SYS_ADMIN_STAFF_LAST_NAME,
  given_name: constants.SYS_ADMIN_STAFF_FIRST_NAME,
  display_name: constants.SYS_ADMIN_STAFF_FULL_NAME,
  email: constants.SYS_ADMIN_STAFF_EMAIL,
  identity_provider: IDP.IDIR,
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: constants.SYS_ADMIN_STAFF_PREFFERED_USER_NAME,
  idir_username: constants.SYS_ADMIN_STAFF_USER_NAME,
  idir_user_guid: constants.SYS_ADMIN_STAFF_USER_GUID,
  bceid_username: undefined,
  bceid_user_guid: undefined,
  bceid_business_guid: undefined,
  bceid_business_name: undefined,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  companyId: undefined,
  claims: [
    //TOCHANGE
    Claim.PUBLIC_AGENT,
    Claim.PUBLIC_ORG_ADMIN,
    Claim.PUBLIC_USER_ADMIN,
    Claim.PUBLIC_VEHICLE_ADMIN,
    Claim.PUBLIC_VERIFIED,
    Claim.READ_BILLING,
    Claim.READ_ORG,
    Claim.READ_PERMIT,
    Claim.READ_SELF,
    Claim.READ_USER,
    Claim.READ_VEHICLE,
    Claim.STAFF,
    Claim.STAFF_ADMIN,
    Claim.STAFF_PERMIT_ISSUER,
    Claim.WRITE_BILLING,
    Claim.WRITE_ORG,
    Claim.WRITE_PERMIT,
    Claim.WRITE_SELF,
    Claim.WRITE_USER,
    Claim.WRITE_VEHICLE,
  ],
  associatedCompanies: undefined,
  access_token: undefined,
  orbcUserFirstName: constants.SYS_ADMIN_STAFF_FIRST_NAME,
  orbcUserLastName: constants.SYS_ADMIN_STAFF_LAST_NAME,
  orbcUserRole: constants.SYS_ADMIN_STAFF_USER_ROLE,
  orbcUserDirectory: constants.SYS_ADMIN_STAFF_USER_STATUS_DIRECOTRY,
  clientId: null,
};
