import { Directory } from '../enum/directory.enum';
import { IDP } from '../enum/idp.enum';
import { Claim } from '../enum/claims.enum';
import { UserRole } from '../enum/user-role.enum';

export interface IUserJWT {
  jti: string;
  auth_time: bigint;
  iat: bigint;
  exp: bigint;
  name: string;
  family_name: string;
  given_name: string;
  display_name: string;
  email: string;
  identity_provider: IDP;
  scope: string;
  azp: string;
  preferred_username: string;
  idir_username: string;
  idir_user_guid: string;
  bceid_username: string;
  bceid_user_guid: string;
  bceid_business_guid: string;
  bceid_business_name: string;
  clientId: string;
  userName: string;
  userGUID: string;
  companyId: number;
  claims: Claim[];
  associatedCompanies: number[];
  access_token: string;
  orbcUserFirstName: string;
  orbcUserLastName: string;
  orbcUserRole: UserRole;
  orbcUserDirectory: Directory;
}
