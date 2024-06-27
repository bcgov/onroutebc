import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtServiceAccountAuthGuard extends AuthGuard(
  'jwt-service-account',
) {
  constructor(private reflector: Reflector) {
    super();
  }
}
