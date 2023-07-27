import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { Request } from 'express';
import { IDP } from '../../enum/idp.enum';
import { Role } from '../../enum/roles.enum';
import { UserStatus } from '../../enum/user-status.enum';
import { AxiosResponse } from 'axios';

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
    const access_token = req.headers.authorization;
    let userGUID: string,
      userName: string,
      roles: Role[],
      associatedCompanies: number[];

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
      userGUID = payload.idir_user_guid;
      userName = payload.idir_username;
    } else if (payload.identity_provider === IDP.BCEID) {
      userGUID = payload.bceid_user_guid;
      userName = payload.bceid_username;
    }

    if (req.headers['AuthOnly'] === 'false') {
      ({ roles, associatedCompanies } = await this.getUserDetails(
        access_token,
        userGUID,
        companyId,
        payload,
        associatedCompanies,
      ));
    }

    const currentUser = {
      userName,
      userGUID,
      roles,
      companyId,
      associatedCompanies,
      access_token,
    };

    Object.assign(payload, currentUser);

    return payload;
  }

  private async getUserDetails(
    access_token: string,
    userGUID: string,
    companyId: number,
    payload: IUserJWT,
    associatedCompanies: number[],
  ) {
    const accessApiResponse: AxiosResponse[] = await Promise.all([
      this.authService.getUserDetails(access_token, userGUID),
      this.authService.getRolesForUser(access_token, companyId),
      payload.identity_provider !== IDP.IDIR
        ? this.authService.getCompaniesForUser(access_token)
        : undefined,
    ]);
    if (
      accessApiResponse.at(0).status !== HttpStatus.OK ||
      (accessApiResponse.at(0).status === HttpStatus.OK &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        accessApiResponse.at(0).data?.statusCode !== UserStatus.ACTIVE)
    ) {
      throw new UnauthorizedException();
    }

    const roles = accessApiResponse.at(1).data as Role[];
    if (payload.identity_provider !== IDP.IDIR) {
      associatedCompanies = (
        accessApiResponse.at(2).data as [
          { companyId: number; clientNumber: string; legalName: string },
        ]
      ).map((company) => {
        return company.companyId;
      });

      if (!associatedCompanies.includes(companyId)) {
        throw new ForbiddenException();
      }
    }
    return { roles, associatedCompanies };
  }
}
