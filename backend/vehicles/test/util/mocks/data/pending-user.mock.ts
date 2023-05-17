import { baseEntityMock } from './base.mock';
import { UserAuthGroup } from '../../../../src/common/enum/user-auth-group.enum';
import { PendingUser } from '../../../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { UpdatePendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/request/update-pending-user.dto';
import { CreatePendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/request/create-pending-user.dto';
import { ReadPendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/response/read-pending-user.dto';

const COMPANY_ID = 1;
const USER_NAME_1 = 'ASMITH';
const USER_NAME_2 = 'JDOE';
const USER_AUTH_GROUP = UserAuthGroup.COMPANY_ADMINISTRATOR;

export const pendingUserEntityMock1: PendingUser = {
  companyId: COMPANY_ID,
  userName: USER_NAME_1,
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};

export const pendingUserEntityMock2: PendingUser = {
  companyId: COMPANY_ID,
  userName: USER_NAME_2,
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};

export const PENDING_USER_LIST: PendingUser[] = [
  pendingUserEntityMock1,
  pendingUserEntityMock2,
];

export const updatePendingUserDtoMock: UpdatePendingUserDto = {
  userAuthGroup: USER_AUTH_GROUP,
};

export const createPendingUserDtoMock: CreatePendingUserDto = {
  userName: USER_NAME_1,
  ...updatePendingUserDtoMock,
};

export const readPendingUserDtoMock: ReadPendingUserDto = {
  companyId: COMPANY_ID,
  ...createPendingUserDtoMock,
};
