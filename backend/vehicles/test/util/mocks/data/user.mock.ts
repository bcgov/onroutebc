import { baseEntityMock } from './base.mock';
import { User } from '../../../../src/modules/company-user-management/users/entities/user.entity';
import * as constants from './test-data.constants';
import { ReadUserDto } from '../../../../src/modules/company-user-management/users/dto/response/read-user.dto';
import { ReadUserOrbcStatusDto } from '../../../../src/modules/company-user-management/users/dto/response/read-user-orbc-status.dto';
import {
  readBlueCompanyMetadataDtoMock,
  readRedCompanyMetadataDtoMock,
} from './company.mock';
import { CreateUserDto } from '../../../../src/modules/company-user-management/users/dto/request/create-user.dto';
import { UpdateUserDto } from '../../../../src/modules/company-user-management/users/dto/request/update-user.dto';
import {
  blueCompanyAdminCompanyUserEntityMock,
  blueCompanyCvClientCompanyUserEntityMock,
  redCompanyAdminCompanyUserEntityMock,
  redCompanyCvClientCompanyUserEntityMock,
} from './company-user.mock';
import {
  redCompanyAdminContactEntityMock,
  createRedCompanyAdminContactDtoMock,
  updateRedCompanyAdminContactDtoMock,
  readRedCompanyAdminContactDtoMock,
  blueCompanyAdminContactEntityMock,
  createBlueCompanyAdminContactDtoMock,
  readBlueCompanyAdminContactDtoMock,
  updateBlueCompanyAdminContactDtoMock,
  updateBlueCompanyCvClientContactDtoMock,
  updateRedCompanyCvClientContactDtoMock,
  readRedCompanyCvClientContactDtoMock,
  blueCompanyCvClientContactEntityMock,
  createBlueCompanyCvClientContactDtoMock,
  readBlueCompanyCvClientContactDtoMock,
  redCompanyCvClientContactEntityMock,
  createRedCompanyCvClientContactDtoMock,
  createSysAdminStaffContactDtoMock,
  readSysAdminStaffContactDtoMock,
  sysAdminStaffContactEntityMock,
  updateSysAdminStaffContactDtoMock,
} from './contact.mock';
import { UpdateUserStatusDto } from '../../../../src/modules/company-user-management/users/dto/request/update-user-status.dto';
import { UserStatus } from '../../../../src/common/enum/user-status.enum';
import { IdirUser } from 'src/modules/company-user-management/users/entities/idir.user.entity';

//User list

export const redCompanyAdminUserEntityMock: User = {
  userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
  userName: constants.RED_COMPANY_ADMIN_USER_NAME,
  directory: constants.RED_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.RED_COMPANY_ADMIN_USER_AUTH_GROUP,
  statusCode: constants.RED_COMPANY_ADMIN_USER_STATUS,
  userContact: { ...redCompanyAdminContactEntityMock },
  companyUsers: [{ ...redCompanyAdminCompanyUserEntityMock }],
  ...baseEntityMock,
};

export const createRedCompanyAdminUserDtoMock: CreateUserDto = {
  userAuthGroup: constants.RED_COMPANY_ADMIN_USER_AUTH_GROUP,
  ...createRedCompanyAdminContactDtoMock,
};

export const updateRedCompanyAdminUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.RED_COMPANY_ADMIN_USER_AUTH_GROUP,
  ...updateRedCompanyAdminContactDtoMock,
};

export const readRedCompanyAdminUserDtoMock: ReadUserDto = {
  userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
  userName: constants.RED_COMPANY_ADMIN_USER_NAME,
  userAuthGroup: constants.RED_COMPANY_ADMIN_USER_AUTH_GROUP,
  statusCode: constants.RED_COMPANY_ADMIN_USER_STATUS,
  ...readRedCompanyAdminContactDtoMock,
};

export const readRedAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyAdminUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
};

export const updateRedCompanyAdminUserStatusDtoMock: UpdateUserStatusDto = {
  statusCode: UserStatus.DISABLED,
};

//Red Company Cv Client User
export const redCompanyCvClientUserEntityMock: User = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.RED_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  userContact: { ...redCompanyCvClientContactEntityMock },
  companyUsers: [{ ...redCompanyCvClientCompanyUserEntityMock }],
  ...baseEntityMock,
};

export const createRedCompanyCvClientUserDtoMock: CreateUserDto = {
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...createRedCompanyCvClientContactDtoMock,
};

export const updateRedCompanyCvClientUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...updateRedCompanyCvClientContactDtoMock,
};

export const updateRedCompanyCvClientUserStatusDtoMock: UpdateUserStatusDto = {
  statusCode: UserStatus.DISABLED,
};

export const readRedCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  ...readRedCompanyCvClientContactDtoMock,
};

export const readRedCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyCvClientUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
};

/***************************************BLUE */

export const blueCompanyAdminUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  directory: constants.BLUE_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.BLUE_COMPANY_ADMIN_USER_AUTH_GROUP,
  statusCode: constants.BLUE_COMPANY_ADMIN_USER_STATUS,
  userContact: { ...blueCompanyAdminContactEntityMock },
  companyUsers: [{ ...blueCompanyAdminCompanyUserEntityMock }],
  ...baseEntityMock,
};

export const createBlueCompanyAdminUserDtoMock: CreateUserDto = {
  userAuthGroup: constants.BLUE_COMPANY_ADMIN_USER_AUTH_GROUP,
  ...createBlueCompanyAdminContactDtoMock,
};

export const updateBlueCompanyAdminUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.BLUE_COMPANY_ADMIN_USER_AUTH_GROUP,
  ...updateBlueCompanyAdminContactDtoMock,
};

export const readBlueCompanyAdminUserDtoMock: ReadUserDto = {
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  userAuthGroup: constants.BLUE_COMPANY_ADMIN_USER_AUTH_GROUP,
  statusCode: constants.BLUE_COMPANY_ADMIN_USER_STATUS,
  ...readBlueCompanyAdminContactDtoMock,
};

export const readBlueAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyAdminUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
};

//Blue Company Cv Client User
export const blueCompanyCvClientUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  userContact: { ...blueCompanyCvClientContactEntityMock },
  companyUsers: [{ ...blueCompanyCvClientCompanyUserEntityMock }],
  ...baseEntityMock,
};

export const createBlueCompanyCvClientUserDtoMock: CreateUserDto = {
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...createBlueCompanyCvClientContactDtoMock,
};

export const updateBlueCompanyCvClientUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...updateBlueCompanyCvClientContactDtoMock,
};

export const updateBlueCompanyCvClientUserStatusDtoMock: UpdateUserStatusDto = {
  statusCode: UserStatus.DISABLED,
};

export const readBlueCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  ...readBlueCompanyCvClientContactDtoMock,
};

export const readBlueCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyCvClientUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
};

//Blue Company Cv Client User
export const sysAdminStaffUserEntityMock: User = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  directory: constants.SYS_ADMIN_STAFF_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  statusCode: constants.SYS_ADMIN_STAFF_USER_STATUS,
  userContact: { ...sysAdminStaffContactEntityMock },
  companyUsers: undefined,
  ...baseEntityMock,
};

export const createSysAdminStaffUserDtoMock: CreateUserDto = {
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  ...createSysAdminStaffContactDtoMock,
};

export const updateSysAdminStaffUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  ...updateSysAdminStaffContactDtoMock,
};

export const updateSysAdminStaffUserStatusDtoMock: UpdateUserStatusDto = {
  statusCode: UserStatus.DISABLED,
};

export const readSysAdminStaffUserDtoMock: ReadUserDto = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  statusCode: constants.SYS_ADMIN_STAFF_USER_STATUS,
  ...readSysAdminStaffContactDtoMock,
};

export const readSysAdminStaffUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readSysAdminStaffUserDtoMock },
  associatedCompanies: [],
  pendingCompanies: [],
};

export const USER_LIST: User[] = [
  redCompanyAdminUserEntityMock,
  redCompanyCvClientUserEntityMock,
  blueCompanyAdminUserEntityMock,
  blueCompanyCvClientUserEntityMock,
  sysAdminStaffUserEntityMock,
];

export const USER_DTO_LIST = [
  {
    userDto: readRedCompanyAdminUserDtoMock,
    companyId: constants.RED_COMPANY_ID,
  },
  {
    userDto: readRedCompanyCvClientUserDtoMock,
    companyId: constants.RED_COMPANY_ID,
  },
  {
    userDto: readBlueCompanyAdminUserDtoMock,
    companyId: constants.BLUE_COMPANY_ID,
  },
  {
    userDto: readBlueCompanyCvClientUserDtoMock,
    companyId: constants.BLUE_COMPANY_ID,
  },
  { userDto: readSysAdminStaffUserDtoMock, companyId: undefined },
];

export const idirUserEntityMock: IdirUser = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  statusCode: constants.SYS_ADMIN_STAFF_USER_STATUS,
  email: constants.SYS_ADMIN_STAFF_EMAIL,
  firstName: constants.SYS_ADMIN_STAFF_FIRST_NAME,
  lastName: constants.SYS_ADMIN_STAFF_LAST_NAME,
  ...baseEntityMock,
};
