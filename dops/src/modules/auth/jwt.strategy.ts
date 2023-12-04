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
import { UserAuthGroup } from '../../enum/user-auth-group.enum';
import { getDirectory } from '../../helper/auth.helper';

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
      associatedCompanies: number[],
      orbcUserFirstName: string,
      orbcUserLastName: string,
      orbcUserAuthGroup: UserAuthGroup;

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

    //Remove when Basic and Personal BCeID needs to be accepted
    if (
      payload.identity_provider === IDP.BCEID &&
      !payload.bceid_business_guid
    ) {
      throw new UnauthorizedException();
    }

    if (req.headers['AuthOnly'] === 'false') {
      ({
        roles,
        associatedCompanies,
        orbcUserFirstName,
        orbcUserLastName,
        orbcUserAuthGroup,
      } = await this.getUserDetails(
        access_token,
        userGUID,
        companyId,
        payload,
        associatedCompanies,
      ));
    }
    const orbcUserDirectory = getDirectory(payload);

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

    return payload;
  }

  private async getUserDetails(
    access_token: string,
    userGUID: string,
    companyId: number,
    payload: IUserJWT,
    associatedCompanies: number[],
  ) {
    if (payload.identity_provider !== IDP.IDIR) {
      const companiesForUsersResponse: AxiosResponse =
        await this.authService.getCompaniesForUser(access_token);
      associatedCompanies = (
        companiesForUsersResponse.data as [
          { companyId: number; clientNumber: string; legalName: string },
        ]
      ).map((company) => {
        return company.companyId;
      });

      //Remove when one login Multiple Companies needs to be activated
      companyId = associatedCompanies?.length
        ? associatedCompanies?.at(0)
        : companyId;

      if (!associatedCompanies.includes(companyId)) {
        throw new ForbiddenException();
      }
    }

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

    const user = accessApiResponse.at(0).data as {
      firstName: string;
      lastName: string;
      userAuthGroup: UserAuthGroup;
    };

    const orbcUserFirstName = user.firstName;
    const orbcUserLastName = user.lastName;
    const orbcUserAuthGroup = user.userAuthGroup;

    const roles = accessApiResponse.at(1).data as Role[];

    return {
      roles,
      associatedCompanies,
      orbcUserFirstName,
      orbcUserLastName,
      orbcUserAuthGroup,
    };
  }
}
