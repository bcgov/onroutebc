/* eslint-disable @typescript-eslint/require-await */
import { UpdatePendingUserDto } from '../../../../src/modules/company-user-management/pending-users/dto/request/update-pending-user.dto';
import {
  PENDING_USER_LIST,
  readPendingUserDtoMock1,
} from '../data/pending-user.mock';

export const pendingUsersServiceMock = {
  create: jest.fn().mockResolvedValue(readPendingUserDtoMock1),
  findPendingUsersDto: jest.fn(async (userName: string, companyId: number) => {
    return filteredList(userName, companyId);
  }),
  remove: jest.fn(async (companyId: number, userName: string) => {
    const retUser = filteredList(userName, companyId);
    if (retUser?.length) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
  update: jest.fn(
    async (
      companyId: number,
      userName: string,
      updatePendingUserDtoMock: UpdatePendingUserDto,
    ) => {
      const pendingUser = filteredList(userName, companyId);
      if (pendingUser?.length) {
        const retpendingUser = pendingUser[0];
        Object.assign(retpendingUser, updatePendingUserDtoMock);
        return retpendingUser;
      } else {
        return null;
      }
    },
  ),
};
function filteredList(userName?: string, companyId?: number) {
  return PENDING_USER_LIST.filter((r) => {
    const isMatchedUserName = userName ? r.userName === userName : true;
    const isMatchedCompanyId = companyId ? r.companyId === companyId : true;
    return isMatchedUserName && isMatchedCompanyId;
  });
}
