import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@common/decorator/public.decorator';
import { IS_AUTH_ONLY_KEY } from '@common/decorator/auth-only.decorator';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'jwt-service-account']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const isAuthOnly = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request: Request = context.switchToHttp().getRequest();

    if (isAuthOnly) {
      request.headers.AuthOnly = 'true';
    } else {
      request.headers.AuthOnly = 'false';
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    void info;
    void context;
    void status;

    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException();
    }
    return user as TUser;
  }
}
