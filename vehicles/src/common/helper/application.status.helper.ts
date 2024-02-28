import { IUserJWT } from '../interface/user-jwt.interface';
import {
  ApplicationStatus,
  CVCLIENT_ACTIVE_APPLICATION_STATUS,
  IDIR_ACTIVE_APPLICATION_STATUS,
} from '../enum/application-status.enum';
import {
  UserAuthGroup,
  idirUserAuthGroupList,
} from '../enum/user-auth-group.enum';

export const getActiveApplicationStatus = (currentUser: IUserJWT) => {
  const applicationStatus: Readonly<ApplicationStatus[]> =
    idirUserAuthGroupList.includes(
      currentUser.orbcUserAuthGroup as UserAuthGroup,
    )
      ? IDIR_ACTIVE_APPLICATION_STATUS
      : CVCLIENT_ACTIVE_APPLICATION_STATUS;

  return applicationStatus;
};
