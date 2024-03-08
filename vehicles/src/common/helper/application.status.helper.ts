import { IUserJWT } from '../interface/user-jwt.interface';
import {
  ApplicationStatus,
  CVCLIENT_ACTIVE_APPLICATION_STATUS,
  IDIR_ACTIVE_APPLICATION_STATUS,
} from '../enum/application-status.enum';
import { IDIR_USER_AUTH_GROUP_LIST } from '../enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from './auth.helper';

export const getActiveApplicationStatus = (currentUser: IUserJWT) => {
  const applicationStatus: Readonly<ApplicationStatus[]> =
    doesUserHaveAuthGroup(
      currentUser.orbcUserAuthGroup,
      IDIR_USER_AUTH_GROUP_LIST,
    )
      ? IDIR_ACTIVE_APPLICATION_STATUS
      : CVCLIENT_ACTIVE_APPLICATION_STATUS;

  return applicationStatus;
};
