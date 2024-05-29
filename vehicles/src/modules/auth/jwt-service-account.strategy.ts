import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthService } from './auth.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

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
    });
  }

   validate(payload: IUserJWT) {
    console.log('payload from jwt sa',payload)
    return  this.authService.validateServiceAccountUser(payload.clientId)
  }
}
