import { baseDtoMock, baseEntityMock } from './base.mock';
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
} from './contact.mock';
import { UserStatus } from '../../../../src/common/enum/user-status.enum';

//User list

export const redCompanyAdminUserEntityMock: User = {
  userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
  userName: constants.RED_COMPANY_ADMIN_USER_NAME,
  directory: constants.RED_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.RED_COMPANY_ADMIN_USER_AUTH_GROUP,
  userContact: { ...redCompanyAdminContactEntityMock },
  companyUsers: [{ ...redCompanyAdminCompanyUserEntityMock }],
  statusCode: constants.RED_COMPANY_ADMIN_USER_STATUS,
  ...baseEntityMock,
};

export const createRedCompanyAdminUserDtoMock: CreateUserDto = {
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
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readRedCompanyAdminContactDtoMock,
};

export const readRedAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyAdminUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
  migratedClient: undefined,
};

//Red Company Cv Client User
export const redCompanyCvClientUserEntityMock: User = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.RED_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  userContact: { ...redCompanyCvClientContactEntityMock },
  companyUsers: [{ ...redCompanyCvClientCompanyUserEntityMock }],
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  ...baseEntityMock,
};

export const createRedCompanyCvClientUserDtoMock: CreateUserDto = {
  ...createRedCompanyCvClientContactDtoMock,
};

export const updateRedCompanyCvClientUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...updateRedCompanyCvClientContactDtoMock,
};

export const readRedCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  userAuthGroup: constants.RED_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readRedCompanyCvClientContactDtoMock,
};

export const readRedCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyCvClientUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
  migratedClient: undefined,
};

/***************************************BLUE */

export const blueCompanyAdminUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  directory: constants.BLUE_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.BLUE_COMPANY_ADMIN_USER_AUTH_GROUP,
  userContact: { ...blueCompanyAdminContactEntityMock },
  companyUsers: [{ ...blueCompanyAdminCompanyUserEntityMock }],
  statusCode: constants.BLUE_COMPANY_ADMIN_USER_STATUS,
  ...baseEntityMock,
};

export const createBlueCompanyAdminUserDtoMock: CreateUserDto = {
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
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readBlueCompanyAdminContactDtoMock,
};

export const readBlueAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyAdminUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
  migratedClient: undefined,
};

//Blue Company Cv Client User
export const blueCompanyCvClientUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  userContact: { ...blueCompanyCvClientContactEntityMock },
  companyUsers: [{ ...blueCompanyCvClientCompanyUserEntityMock }],
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  ...baseEntityMock,
};

export const createBlueCompanyCvClientUserDtoMock: CreateUserDto = {
  ...createBlueCompanyCvClientContactDtoMock,
};

export const updateBlueCompanyCvClientUserDtoMock: UpdateUserDto = {
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  ...updateBlueCompanyCvClientContactDtoMock,
};

export const readBlueCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  userAuthGroup: constants.BLUE_COMPANY_CVCLIENT_USER_AUTH_GROUP,
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readBlueCompanyCvClientContactDtoMock,
};

export const readBlueCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyCvClientUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
  migratedClient: undefined,
};

//Blue Company Cv Client User
export const sysAdminStaffUserEntityMock: User = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  directory: constants.SYS_ADMIN_STAFF_USER_STATUS_DIRECOTRY,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  userContact: { ...sysAdminStaffContactEntityMock },
  statusCode: UserStatus.ACTIVE,
  ...baseEntityMock,
};

export const createSysAdminStaffUserDtoMock: CreateUserDto = {
  ...createSysAdminStaffContactDtoMock,
};

export const readSysAdminStaffUserDtoMock: ReadUserDto = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  statusCode: constants.SYS_ADMIN_STAFF_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readSysAdminStaffContactDtoMock,
};

export const readSysAdminStaffUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readSysAdminStaffUserDtoMock },
  associatedCompanies: [],
  pendingCompanies: [],
  migratedClient: undefined,
};

export const USER_LIST: User[] = [
  redCompanyAdminUserEntityMock,
  redCompanyCvClientUserEntityMock,
  blueCompanyAdminUserEntityMock,
  blueCompanyCvClientUserEntityMock,
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
];
