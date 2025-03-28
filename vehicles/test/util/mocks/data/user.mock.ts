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
  userRole: constants.USER_ROLE_PUBLIC,
  userContact: { ...redCompanyAdminContactEntityMock },
  companyUsers: [{ ...redCompanyAdminCompanyUserEntityMock }],
  statusCode: constants.RED_COMPANY_ADMIN_USER_STATUS,
  ...baseEntityMock,
};

export const createRedCompanyAdminUserDtoMock: CreateUserDto = {
  ...createRedCompanyAdminContactDtoMock,
};

export const updateRedCompanyAdminUserDtoMock: UpdateUserDto = {
  userRole: constants.RED_COMPANY_ADMIN_ROLE_GROUP,
  ...updateRedCompanyAdminContactDtoMock,
};

export const readRedCompanyAdminUserDtoMock: ReadUserDto = {
  userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
  userName: constants.RED_COMPANY_ADMIN_USER_NAME,
  userRole: constants.RED_COMPANY_ADMIN_ROLE_GROUP,
  statusCode: constants.RED_COMPANY_ADMIN_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readRedCompanyAdminContactDtoMock,
};

export const readRedAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyAdminUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
  unclaimedClient: undefined,
};

//Red Company Cv Client User
export const redCompanyCvClientUserEntityMock: User = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.RED_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userRole: constants.USER_ROLE_PUBLIC,
  userContact: { ...redCompanyCvClientContactEntityMock },
  companyUsers: [{ ...redCompanyCvClientCompanyUserEntityMock }],
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  ...baseEntityMock,
};

export const createRedCompanyCvClientUserDtoMock: CreateUserDto = {
  ...createRedCompanyCvClientContactDtoMock,
};

export const updateRedCompanyCvClientUserDtoMock: UpdateUserDto = {
  userRole: constants.RED_COMPANY_CVCLIENT_ROLE_GROUP,
  ...updateRedCompanyCvClientContactDtoMock,
};

export const readRedCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.RED_COMPANY_CVCLIENT_USER_NAME,
  userRole: constants.RED_COMPANY_CVCLIENT_ROLE_GROUP,
  statusCode: constants.RED_COMPANY_CVCLIENT_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readRedCompanyCvClientContactDtoMock,
};

export const readRedCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readRedCompanyCvClientUserDtoMock },
  associatedCompanies: [readRedCompanyMetadataDtoMock],
  pendingCompanies: [],
  unclaimedClient: undefined,
};

/***************************************BLUE */

export const blueCompanyAdminUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  directory: constants.BLUE_COMPANY_ADMIN_USER_STATUS_DIRECOTRY,
  userRole: constants.USER_ROLE_PUBLIC,
  userContact: { ...blueCompanyAdminContactEntityMock },
  companyUsers: [{ ...blueCompanyAdminCompanyUserEntityMock }],
  statusCode: constants.BLUE_COMPANY_ADMIN_USER_STATUS,
  ...baseEntityMock,
};

export const createBlueCompanyAdminUserDtoMock: CreateUserDto = {
  ...createBlueCompanyAdminContactDtoMock,
};

export const updateBlueCompanyAdminUserDtoMock: UpdateUserDto = {
  userRole: constants.BLUE_COMPANY_ADMIN_USER_ROLE,
  ...updateBlueCompanyAdminContactDtoMock,
};

export const readBlueCompanyAdminUserDtoMock: ReadUserDto = {
  userGUID: constants.BLUE_COMPANY_ADMIN_USER_GUID,
  userName: constants.BLUE_COMPANY_ADMIN_USER_NAME,
  userRole: constants.BLUE_COMPANY_ADMIN_USER_ROLE,
  statusCode: constants.BLUE_COMPANY_ADMIN_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readBlueCompanyAdminContactDtoMock,
};

export const readBlueAdminUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyAdminUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
  unclaimedClient: undefined,
};

//Blue Company Cv Client User
export const blueCompanyCvClientUserEntityMock: User = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  directory: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS_DIRECOTRY,
  userRole: constants.USER_ROLE_PUBLIC,
  userContact: { ...blueCompanyCvClientContactEntityMock },
  companyUsers: [{ ...blueCompanyCvClientCompanyUserEntityMock }],
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  ...baseEntityMock,
};

export const createBlueCompanyCvClientUserDtoMock: CreateUserDto = {
  ...createBlueCompanyCvClientContactDtoMock,
};

export const updateBlueCompanyCvClientUserDtoMock: UpdateUserDto = {
  userRole: constants.BLUE_COMPANY_CVCLIENT_USER_ROLE,
  ...updateBlueCompanyCvClientContactDtoMock,
};

export const readBlueCompanyCvClientUserDtoMock: ReadUserDto = {
  userGUID: constants.BLUE_COMPANY_CVCLIENT_USER_GUID,
  userName: constants.BLUE_COMPANY_CVCLIENT_USER_NAME,
  userRole: constants.BLUE_COMPANY_CVCLIENT_USER_ROLE,
  statusCode: constants.BLUE_COMPANY_CVCLIENT_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readBlueCompanyCvClientContactDtoMock,
};

export const readBlueCvClientUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readBlueCompanyCvClientUserDtoMock },
  associatedCompanies: [readBlueCompanyMetadataDtoMock],
  pendingCompanies: [],
  unclaimedClient: undefined,
};

//Blue Company Cv Client User
export const sysAdminStaffUserEntityMock: User = {
  userGUID: constants.SYS_ADMIN_STAFF_USER_GUID,
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  directory: constants.SYS_ADMIN_STAFF_USER_STATUS_DIRECOTRY,
  userRole: constants.SYS_ADMIN_STAFF_USER_ROLE,
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
  userRole: constants.SYS_ADMIN_STAFF_USER_ROLE,
  statusCode: constants.SYS_ADMIN_STAFF_USER_STATUS,
  createdDateTime: baseDtoMock.createdDateTime,
  updatedDateTime: baseDtoMock.updatedDateTime,
  ...readSysAdminStaffContactDtoMock,
};

export const readSysAdminStaffUserOrbcStatusDtoMock: ReadUserOrbcStatusDto = {
  user: { ...readSysAdminStaffUserDtoMock },
  associatedCompanies: [],
  pendingCompanies: [],
  unclaimedClient: undefined,
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
