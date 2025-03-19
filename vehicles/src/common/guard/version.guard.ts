import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class VersionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (
      !request.headers['x-onroutebc-version'] ||
      request.headers['x-onroutebc-version'] !== process.env.ONROUTEBC_VERSION
    ) {
      throw new UnprocessableEntityException();
    } else {
      return true;
    }
  }
}
