import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { IDP } from 'src/common/enum/idp.enum';
import { Directory } from 'src/common/enum/directory.enum';
import { Request } from 'express';

@Injectable()
export class JwtServiceAccountStrategy extends PassportStrategy(
  Strategy,
  'jwt-service-account',
) {
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
      audience: process.env.ORBC_SERVICE_ACCOUNT_AUDIENCE,
      issuer: `${process.env.KEYCLOAK_ISSUER_URL}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IUserJWT) {
    const result = this.authService.validateServiceAccountUser(
      payload.clientId,
    );
    if (result) {
      const userName = 'service-account-on-route-bc';
      const userGUID = payload.clientId;
      const orbcUserDirectory = Directory.SERVICE_ACCOUNT;
      const identity_provider = IDP.SERVICE_ACCOUNT;
      const access_token = req.headers.authorization;
      const currentUser = {
        userName,
        userGUID,
        identity_provider,
        access_token,
        orbcUserDirectory,
      };
      Object.assign(payload, currentUser);
      return payload;
    } else throw new UnauthorizedException();
  }
}
