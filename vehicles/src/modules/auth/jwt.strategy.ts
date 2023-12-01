import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Request } from 'express';
import { Role } from '../../common/enum/roles.enum';
import { IDP } from '../../common/enum/idp.enum';
import {
  getDirectory,
  matchCompanies,
  validateUserCompanyAndRoleContext,
} from '../../common/helper/auth.helper';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';
import { AccountSource } from 'src/common/enum/account-source.enum';
import { UserAuthGroup } from '../../common/enum/user-auth-group.enum';
import { Directory } from '../../common/enum/directory.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}/protocol/openid-connect/certs`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.AUTH0_IGNORE_EXP === 'true' ? true : false,
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IUserJWT): Promise<IUserJWT> {
    let userGUID: string,
      userName: string,
      roles: Role[],
      associatedCompanies: number[],
      orbcUserFirstName: string,
      orbcUserLastName: string,
      orbcUserAuthGroup: UserAuthGroup,
      orbcUserDirectory: Directory;

    let companyId: number;
    if (req.params['companyId']) {
      companyId = +req.params['companyId'];
    } else if (req.query['companyId']) {
      companyId = +req.query['companyId'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (req.body.companyId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      companyId = req.body.companyId as number;
    }

    if (payload.identity_provider === IDP.IDIR) {
      companyId = 0;
      userGUID = payload.idir_user_guid;
      userName = payload.idir_username;
      payload.accountSource = AccountSource.PPCStaff;
    } else if (payload.identity_provider === IDP.BCEID) {
      userGUID = payload.bceid_user_guid;
      userName = payload.bceid_username;
      payload.accountSource = AccountSource.BCeID;
    }

    //Remove when Basic and Personal BCeID needs to be accepted
    if (
      payload.identity_provider === IDP.BCEID &&
      !payload.bceid_business_guid
    ) {
      throw new UnauthorizedException();
    }

    if (req.headers['AuthOnly'] === 'false') {
      const user = await this.authService.getUserDetails(
        companyId,
        payload.identity_provider,
        userGUID,
      );
      if (!user?.length) {
        throw new UnauthorizedException();
      }
      orbcUserFirstName = user?.at(0).firstName;
      orbcUserLastName = user?.at(0).lastName;
      orbcUserAuthGroup = user?.at(0).userAuthGroup;
      orbcUserDirectory = getDirectory(payload);

      if (payload.identity_provider !== IDP.IDIR) {
        associatedCompanies = await this.authService.getCompaniesForUser(
          userGUID,
        );
        //Remove when one login Multiple Companies needs to be activated
        companyId = associatedCompanies?.length
          ? associatedCompanies?.at(0)
          : companyId;
      }

      roles = await this.authService.getRolesForUser(userGUID, companyId);
    }

    const access_token = req.headers.authorization;

    const currentUser = {
      userName,
      userGUID,
      roles,
      companyId,
      associatedCompanies,
      access_token,
      orbcUserFirstName,
      orbcUserLastName,
      orbcUserAuthGroup,
      orbcUserDirectory,
    };

    Object.assign(payload, currentUser);

    /*Additional validations to validate userGuid and company context where
    userGUID is explicitly provided as either path or query parameter*/
    await this.AdditionalValidations(req, payload, companyId);

    return payload;
  }

  private async AdditionalValidations(
    req: Request,
    payload: IUserJWT,
    companyId: number,
  ) {
    let userGUIDParam: string;
    if (req.params['userGUID']) {
      userGUIDParam = req.params['userGUID'];
    } else if (req.query['userGUID']) {
      userGUIDParam = req.query['userGUID']?.toString();
    }

    if (
      req.headers['AuthOnly'] === 'false' &&
      payload.identity_provider !== IDP.IDIR &&
      userGUIDParam
    ) {
      const associatedCompanies = await this.authService.getCompaniesForUser(
        userGUIDParam,
      );

      if (!associatedCompanies?.length) {
        throw new DataNotFoundException();
      }
      if (
        !companyId &&
        !matchCompanies(associatedCompanies, payload.associatedCompanies)
      ) {
        throw new ForbiddenException();
      } else if (companyId && userGUIDParam !== payload.userGUID) {
        let roles: Role[];
        if (req.method === 'GET') {
          roles = [Role.READ_USER];
        } else {
          roles = [Role.WRITE_USER];
        }
        validateUserCompanyAndRoleContext(
          roles,
          userGUIDParam,
          associatedCompanies,
          payload,
        );
      }
    }
  }
}
