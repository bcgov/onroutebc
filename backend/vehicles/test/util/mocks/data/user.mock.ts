import { baseEntityMock } from './base.mock';
import { UserAuthGroup } from '../../../../src/common/enum/user-auth-group.enum';
import { User } from '../../../../src/modules/company-user-management/users/entities/user.entity';
import { Directory } from '../../../../src/common/enum/directory.enum';
import { UserStatus } from '../../../../src/common/enum/user-status.enum';
import {
  contactEntityMock,
  createContactDtoMock,
  readContactDtoMock,
  updateContactDtoMock,
} from './contact.mock';
import { CreateUserDto } from '../../../../src/modules/company-user-management/users/dto/request/create-user.dto';
import { UpdateUserDto } from '../../../../src/modules/company-user-management/users/dto/request/update-user.dto';
import { ReadUserDto } from '../../../../src/modules/company-user-management/users/dto/response/read-user.dto';
import { companyUserEntityMock } from './company-user.mock';
import { IUserJWT } from '../../../../src/common/interface/user-jwt.interface';

const USER_GUID = '06267945F2EB4E31B585932F78B76269';
const USER_NAME = 'REDTRUCK';
const USER_AUTH_GROUP = UserAuthGroup.COMPANY_ADMINISTRATOR;
const DIRECOTRY = Directory.BBCEID;
const USER_STATUS = UserStatus.ACTIVE;

export const userEntityMock: User = {
  userGUID: USER_GUID,
  userName: USER_NAME,
  directory: DIRECOTRY,
  userAuthGroup: USER_AUTH_GROUP,
  statusCode: USER_STATUS,
  userContact: { ...contactEntityMock },
  companyUsers: [{ ...companyUserEntityMock }],
  ...baseEntityMock,
};

export const createUserDtoMock: CreateUserDto = {
  userAuthGroup: USER_AUTH_GROUP,
  ...createContactDtoMock,
};

export const updateUserDtoMock: UpdateUserDto = {
  userAuthGroup: USER_AUTH_GROUP,
  ...updateContactDtoMock,
};

export const readUserDtoMock: ReadUserDto = {
  userGUID: USER_GUID,
  userName: USER_NAME,
  userAuthGroup: USER_AUTH_GROUP,
  statusCode: USER_STATUS,
  ...readContactDtoMock,
};

export const currentUserMock: IUserJWT = {
  jti: 'aa946bbe-5a4a-4be3-bf76-b2dd131a501f',
  auth_time: BigInt(1681237766),
  iat: BigInt(1681237767),
  exp: BigInt(1681238067),
  name: 'Adam Smith',
  family_name: 'Smith',
  given_name: 'Adam',
  display_name: 'Adam Smith',
  email: 'test@test.gov.bc.ca',
  identity_provider: 'bceidboth',
  scope: 'openid idir bceidboth email profile',
  azp: 'on-route-bc',
  preferred_username: '06267945f2eb4e31b585932f78b76269@bceidboth',
  idir_username: undefined,
  idir_user_guid: undefined,
  bceid_username: undefined,
  bceid_user_guid: undefined,
  bceid_business_guid: '6F9619FF8B86D011B42D00C04FC964FF',
  bceid_business_name: 'ABC Carriers Inc.',
  userName: USER_NAME,
  userGUID: USER_GUID,
  companyId: 1,
  roles: null,
  associatedCompanies: [1],
};
