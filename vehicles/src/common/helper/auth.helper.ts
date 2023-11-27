import { ForbiddenException } from '@nestjs/common';
import { Directory } from '../enum/directory.enum';
import { IDP } from '../enum/idp.enum';
import { Role } from '../enum/roles.enum';
import { IUserJWT } from '../interface/user-jwt.interface';

export const getDirectory = (user: IUserJWT) => {
  if (user.identity_provider === IDP.IDIR) {
    return Directory.IDIR;
  } else if (user.identity_provider === IDP.BCEID) {
    if (user.bceid_business_guid) {
      return Directory.BBCEID;
    } else {
      return Directory.BCEID;
    }
  } else {
    return Directory.BCSC;
  }
};

export const matchRoles = (roles: Role[], userRoles: Role[]) => {
  return roles.some((role) => userRoles?.includes(role));
};

export const matchCompanies = (
  associatedCompanies: number[],
  currentUserAssociatedCompanies: number[],
) => {
  return associatedCompanies.some(
    (associatedCompany) =>
      currentUserAssociatedCompanies?.includes(associatedCompany),
  );
};

export const checkAssociatedCompanies = (
  companyId: number,
  userCompanies: number[],
) => {
  return userCompanies?.includes(companyId);
};

export const checkUserCompaniesContext = (
  userCompanies: number[],
  user: IUserJWT,
) => {
  if (
    user.identity_provider !== IDP.IDIR &&
    !checkAssociatedCompanies(user.companyId, userCompanies)
  ) {
    throw new ForbiddenException();
  }

  return true;
};

export const validateUserCompanyAndRoleContext = (
  roles: Role[],
  userGUID: string,
  userCompanies: number[],
  currentUser: IUserJWT,
) => {
  const rolesExists = matchRoles(roles, currentUser.roles);
  if (!rolesExists && userGUID) {
    throw new ForbiddenException();
  }
  if (
    rolesExists &&
    userGUID &&
    !checkUserCompaniesContext(userCompanies, currentUser)
  ) {
    throw new ForbiddenException();
  }
};
