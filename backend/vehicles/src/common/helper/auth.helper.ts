import { Directory } from '../enum/directory.enum';
import { IDP } from '../enum/idp.enum';
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
