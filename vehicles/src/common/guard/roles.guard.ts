import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IDP } from '../enum/idp.enum';
import { matchRoles } from '../helper/auth.helper';
import { IUserJWT } from '../interface/user-jwt.interface';
import { IRole } from '../interface/role.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<IRole>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Guard is invoked regardless of the decorator being actively called
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider === IDP.SERVICE_ACCOUNT) {
      return true;
    }

    return matchRoles(roles, currentUser.roles, currentUser.orbcUserAuthGroup);
  }
}
