import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserAuthGroup } from '../enum/user-auth-group.enum';
import { Request } from 'express';
import { IUserJWT } from '../interface/user-jwt.interface';

interface Config {
  allowedGroups: UserAuthGroup;
}

export class AllowedIf<T, V extends Config> {
  value: T;
  config: V;
  constructor(@Inject(REQUEST) private request: Request, value: T, ) {
    const userInRequest = request.user as IUserJWT;
    
    userInRequest.orbcUserAuthGroup
  }
}
