import { CreatePendingIdirUserDto } from 'src/modules/company-user-management/pending-idir-users/dto/request/create-pending-idir-user.dto';
import { baseEntityMock } from './base.mock';
import * as constants from './test-data.constants';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { ReadPendingIdirUserDto } from 'src/modules/company-user-management/pending-idir-users/dto/response/read-pending-idir-user.dto';

export const pendingIdirUserEntityMock: PendingIdirUser = {
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
  ...baseEntityMock,
};

export const createPendingIdirUserMock: CreatePendingIdirUserDto = {
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
};

export const readPendingIdirUserMock: ReadPendingIdirUserDto = {
  userName: constants.SYS_ADMIN_STAFF_USER_NAME,
  userAuthGroup: constants.SYS_ADMIN_STAFF_USER_AUTH_GROUP,
};
