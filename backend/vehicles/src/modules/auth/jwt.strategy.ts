import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Request } from 'express';
import { Role } from '../../common/enum/roles.enum';
import { IDP } from '../../common/enum/idp.enum';

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
    let userGUID: string, userName: string, roles: Role[];

    const companyId = req.params['companyId']
      ? +req.params['companyId']
      : undefined;

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
        userName,
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      roles = await this.authService.getRolesForUser(userGUID, companyId);
    }

    const currentUser = {
      userName,
      userGUID,
      roles,
      companyId,
    };

    Object.assign(payload, currentUser);
    return payload;
  }
}
