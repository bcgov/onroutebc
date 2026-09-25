import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IUserJWT } from '@app/interface/user-jwt.interface';
import { matchRoles } from '@app/helper/auth.helper';
import { IDP } from '@app/enum/idp.enum';
import { IPermissions } from '@app/interface/permissions.interface';
import { PERMISSIONS_KEY } from '@app/constants/dops.constant';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.getAllAndOverride<IPermissions>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Guard is invoked regardless of the decorator being actively called
    if (!permissions) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider === IDP.SERVICE_ACCOUNT) {
      return true;
    }
    return matchRoles(
      permissions,
      currentUser.claims,
      currentUser.orbcUserRole,
    );
  }
}
