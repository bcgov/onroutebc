import { baseEntityMock } from './base.mock';
import { UserAuthGroup } from '../../../../src/common/enum/user-auth-group.enum';
import { PendingUser } from '../../../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { UpdatePendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/request/update-pending-user.dto';
import { CreatePendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/request/create-pending-user.dto';
import { ReadPendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/response/read-pending-user.dto';
import { createContactDtoMock } from './contact.mock';

const COMPANY_ID = 1;
const USER_NAME = 'ASMITH';
const USER_AUTH_GROUP = UserAuthGroup.COMPANY_ADMINISTRATOR;

export const pendingUserEntityMock: PendingUser = {
  companyId: COMPANY_ID,
  userName: USER_NAME,
  userAuthGroup: USER_AUTH_GROUP,
  ...baseEntityMock,
};

export const updatePendingUserDtoMock: UpdatePendingUserDto = {
  userAuthGroup: USER_AUTH_GROUP,
  ...createContactDtoMock,
};

export const createPendingUserDtoMock: CreatePendingUserDto = {
  userName: USER_NAME,
  ...updatePendingUserDtoMock,
};

export const readPendingUserDtoMock: ReadPendingUserDto = {
  companyId: COMPANY_ID,
  ...createPendingUserDtoMock,
};
