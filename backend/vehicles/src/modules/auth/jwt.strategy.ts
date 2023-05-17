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
  matchCompanies,
  validateUserCompanyAndRoleContext,
} from '../../common/helper/auth.helper';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';

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
      associatedCompanies: number[];

    let companyId: number;
    if (req.params['companyId']) {
      companyId = +req.params['companyId'];
    } else if (req.query['companyId']) {
      companyId = +req.query['companyId'];
    }

    if (payload.identity_provider === IDP.IDIR) {
      userGUID = payload.idir_user_guid;
      userName = payload.idir_username;
    } else if (payload.identity_provider === IDP.BCEID) {
      userGUID = payload.bceid_user_guid;
      userName = payload.bceid_username;
    }

    if (req.headers['AuthOnly'] === 'false') {
      const user = await this.authService.validateUser(
        companyId,
        payload.identity_provider,
        userGUID,
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      roles = await this.authService.getRolesForUser(userGUID, companyId);
      associatedCompanies = await this.authService.getCompaniesForUser(
        userGUID,
      );
    }

    const currentUser = {
      userName,
      userGUID,
      roles,
      companyId,
      associatedCompanies,
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
