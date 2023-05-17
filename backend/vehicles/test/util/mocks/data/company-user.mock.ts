import { baseEntityMock } from './base.mock';
import { UserAuthGroup } from '../../../../src/common/enum/user-auth-group.enum';
import { CompanyUser } from '../../../../src/modules/company-user-management/users/entities/company-user.entity';
import { companyEntityMock } from './company.mock';
import { userEntityMock1, userEntityMock2 } from './user.mock';

const COMPANY_USER_ID = 1;
const USER_AUTH_GROUP = UserAuthGroup.COMPANY_ADMINISTRATOR;

export const companyUserEntityMock1: CompanyUser = {
  companyUserId: COMPANY_USER_ID,
  company: { ...companyEntityMock },
  user: { ...userEntityMock1 },
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};

export const companyUserEntityMock2: CompanyUser = {
  companyUserId: COMPANY_USER_ID,
  company: { ...companyEntityMock },
  user: { ...userEntityMock2 },
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};
