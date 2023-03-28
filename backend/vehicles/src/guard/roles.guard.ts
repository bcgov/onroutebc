import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from 'src/common/decorator/roles.decoratos';
import { Role } from 'src/common/enum/role.enum';
import { UserDetailsDto } from 'src/modules/common/dto/response/user-details.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req: Request = context.switchToHttp().getRequest();
    const user: UserDetailsDto = req.userDetails;
    console.log(' UserDetailsDto ', user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(
      'Required roles ',
      requiredRoles.some((role) =>
        user.userCompany.userRoles?.includes(role),
      ) || requiredRoles.some((role) => user.roles?.includes(role)),
    );
    return (
      requiredRoles.some((role) =>
        user.userCompany.userRoles?.includes(role),
      ) || requiredRoles.some((role) => user.roles?.includes(role))
    );
  }
}
