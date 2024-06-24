import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/roles.enum';
import { Request } from 'express';
import { IUserJWT } from '../interface/user-jwt.interface';
import { matchRoles } from '../helper/auth.helper';
import { IRole } from '../interface/role.interface';
import { IDP } from '../enum/idp.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | IRole[]>('roles', [
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
