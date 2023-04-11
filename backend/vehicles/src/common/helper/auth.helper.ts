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

export const checkAssociatedCompanies = (
  companyId: number,
  associatedCompanies: number[],
) => {
  return associatedCompanies?.includes(companyId);
};

export const checkUserCompaniesContext = (userGuid: string, user: IUserJWT) => {
  if (
    userGuid &&
    user.identity_provider !== IDP.IDIR &&   
    !checkAssociatedCompanies(user.companyId, user.associatedCompanies)
  ) {
    throw new ForbiddenException();
  }

  return true;
};
