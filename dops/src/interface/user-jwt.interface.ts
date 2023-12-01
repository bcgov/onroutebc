import { Directory } from '../enum/directory.enum';
import { Role } from '../enum/roles.enum';
import { UserAuthGroup } from '../enum/user-auth-group.enum';

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
  identity_provider: string;
  scope: string;
  azp: string;
  preferred_username: string;
  idir_username: string;
  idir_user_guid: string;
  bceid_username: string;
  bceid_user_guid: string;
  bceid_business_guid: string;
  bceid_business_name: string;
  userName: string;
  userGUID: string;
  companyId: number;
  roles: Role[];
  associatedCompanies: number[];
  access_token: string;  
  orbcUserFirstName: string;
  orbcUserLastName: string;
  orbcUserAuthGroup: UserAuthGroup;
  orbcUserDirectory: Directory;
}
