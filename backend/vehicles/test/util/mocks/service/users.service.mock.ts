/* eslint-disable @typescript-eslint/require-await */
import { Role } from '../../../../src/common/enum/roles.enum';
import { UserStatus } from '../../../../src/common/enum/user-status.enum';
import { UpdateUserDto } from '../../../../src/modules/company-user-management/users/dto/request/update-user.dto';
import {
  USER_LIST,
  readUserDtoMock,
  readUserOrbcStatusDtoMock,
} from '../data/user.mock';

export const usersServiceMock = {
  create: jest.fn().mockResolvedValue(readUserDtoMock),
  findORBCUser: jest.fn().mockResolvedValue(readUserOrbcStatusDtoMock),
  getRolesForUser: jest
    .fn()
    .mockResolvedValue([
      Role.READ_SELF,
      Role.READ_USER,
      Role.WRITE_SELF,
      Role.WRITE_USER,
    ]),
  findUsersDto: jest.fn(async (userGUID: string, companyId: number[]) => {
    return filteredList(userGUID, companyId);
  }),
  update: jest.fn(
    async (userGUID: string, updateUserDtoMock1: UpdateUserDto) => {
      const users = filteredList(userGUID);
      if (users?.length) {
        const retUser = users[0];
        Object.assign(retUser, updateUserDtoMock1);
        return updateUserDtoMock1;
      } else {
        return null;
      }
    },
  ),
  updateStatus: jest.fn(async (userGUID: string, userStatus: UserStatus) => {
    const users = filteredList(userGUID);
    if (users?.length) {
      const retUser = users[0];
      Object.assign(retUser, userStatus);
      return retUser;
    } else {
      return null;
    }
  }),
};
function filteredList(userGUID?: string, companyId?: number[]) {
  return USER_LIST.filter((r) => {
    const isMatchedUserGUID = userGUID ? r.userName === userGUID : true;
    const isMatchedCompanyId = companyId?.length
      ? companyId.includes(r.companyUsers[0].company.companyId)
      : true;
    return isMatchedUserGUID && isMatchedCompanyId;
  });
}
