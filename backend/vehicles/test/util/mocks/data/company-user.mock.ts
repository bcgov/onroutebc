import { baseEntityMock } from './base.mock';
import { UserAuthGroup } from '../../../../src/common/enum/user-auth-group.enum';
import { CompanyUser } from '../../../../src/modules/company-user-management/users/entities/company-user.entity';
import { companyEntityMock } from './company.mock';
import { userEntityMock } from './user.mock';

const COMPANY_USER_ID = 1;
const USER_AUTH_GROUP = UserAuthGroup.COMPANY_ADMINISTRATOR;

export const companyUserEntityMock: CompanyUser = {
  companyUserId: COMPANY_USER_ID,
  company: { ...companyEntityMock },
  user: { ...userEntityMock },
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};
