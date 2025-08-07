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
import { Claim } from '../../common/enum/claims.enum';
import { IDP } from '../../common/enum/idp.enum';
import {
  getDirectory,
  matchCompanies,
  validateUserCompanyAndRoleContext,
} from '../../common/helper/auth.helper';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';
import {
  ClientUserRole,
  IDIRUserRole,
  UserRole,
} from '../../common/enum/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.KEYCLOAK_ISSUER_URL}/protocol/openid-connect/certs`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:
        process.env.KEYCLOAK_IGNORE_EXP === 'true' ? true : false,
      audience: process.env.KEYCLOAK_AUDIENCE,
      issuer: `${process.env.KEYCLOAK_ISSUER_URL}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IUserJWT): Promise<IUserJWT> {
    let userGUID: string,
      userName: string,
      claims: Claim[],
      associatedCompanies: number[],
      orbcUserFirstName: string,
      orbcUserLastName: string,
      orbcUserRole: UserRole | ClientUserRole | IDIRUserRole;

    let companyId: number;
    if (req?.params?.companyId) {
      companyId = +req.params.companyId;
    } else if (req?.query?.companyId) {
      companyId = +req.query.companyId;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (req?.body?.companyId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      companyId = req.body.companyId as number;
    }

    if (payload.identity_provider === IDP.IDIR) {
      companyId = 0;
      userGUID = payload.idir_user_guid;
      userName = payload.idir_username;
    } else if (payload.identity_provider === IDP.BCEID) {
      userGUID = payload.bceid_user_guid;
      userName = payload.bceid_username;
    } else {
      throw new UnauthorizedException();
    }

    const orbcUserDirectory = getDirectory(payload);

    if (req.headers.AuthOnly === 'false') {
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
      orbcUserRole = user?.at(0).userRole;

      if (payload.identity_provider !== IDP.IDIR) {
        const associatedCompanyMetadataList =
          await this.authService.getCompaniesForUser(userGUID);

        associatedCompanies = associatedCompanyMetadataList?.map(
          (company) => +company.companyId,
        );
        //Remove when one login Multiple Companies needs to be activated
        companyId = associatedCompanies?.length
          ? associatedCompanies?.at(0)
          : companyId;
        if (
          !associatedCompanies.includes(companyId) ||
          associatedCompanyMetadataList?.at(0)?.isSuspended
        ) {
          throw new ForbiddenException();
        }
      }

      claims = await this.authService.getClaimsForUser(userGUID, companyId);
    }

    const access_token = req.headers.authorization;

    const currentUser = {
      userName,
      userGUID,
      claims,
      companyId,
      associatedCompanies,
      access_token,
      orbcUserFirstName,
      orbcUserLastName,
      orbcUserRole,
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
    if (req.params.userGUID) {
      userGUIDParam = req.params.userGUID;
    } else if (typeof req.query.userGUID === 'string') {
      userGUIDParam = req.query.userGUID;
    }

    if (
      req.headers.AuthOnly === 'false' &&
      payload.identity_provider !== IDP.IDIR &&
      userGUIDParam
    ) {
      const associatedCompaniesMetadata =
        await this.authService.getCompaniesForUser(userGUIDParam);

      const associatedCompanies = associatedCompaniesMetadata?.map(
        (company) => +company.companyId,
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
        let claim: Claim;
        if (req.method === 'GET') {
          claim = Claim.READ_USER;
        } else {
          claim = Claim.WRITE_USER;
        }
        validateUserCompanyAndRoleContext(
          claim,
          userGUIDParam,
          associatedCompanies,
          payload,
        );
      }
    }
  }
}
