import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Request } from 'express';

@Injectable()
export class JwtServiceAccountStrategy extends PassportStrategy(
  Strategy,
  'jwt-service-account',
) {
  constructor(private authService: AuthService) {
    console.log('jwt sa constructor');
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
      audience: process.env.KEYCLOAK_SERVICE_ACCOUNT_AUDIENCE,
      issuer: `${process.env.KEYCLOAK_ISSUER_URL}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IUserJWT): Promise<unknown> {
    console.log('validate sa jwt');
    console.log('payload', payload);
    return await this.authService.validateUser('ORBC', 'ORBC');
  }
}
