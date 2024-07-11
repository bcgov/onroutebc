/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/roles.enum';
import { UserAuthGroup } from '../enum/user-auth-group.enum';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @AllowFieldIf Decorator
 *
 * This decorator is used to conditionally allow certain fields in a request based on
 * the user's roles and authentication groups.
 *
 * @param {Object} metadata - Metadata to control field allowance
 * @param {Role} metadata.allowedRole - Role that is permitted access to the field
 * @param {UserAuthGroup} [metadata.allowedAuthGroups] - Authentication groups that are allowed access to the field (optional)
 * @param {UserAuthGroup} [metadata.disallowedAuthGroups] - Authentication groups that are explicitly denied access to the field (optional)
 */

export const AllowFieldIf = Reflector.createDecorator<{
  allowedRole: Role;
  allowedAuthGroups?: UserAuthGroup;
  disallowedAuthGroups?: UserAuthGroup;
}>();

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
