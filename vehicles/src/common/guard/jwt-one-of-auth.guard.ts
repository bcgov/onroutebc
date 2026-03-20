import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './auth.guard';
import { JwtServiceAccountAuthGuard } from './jwt-sa-auth.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtOneOfAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwtAuthGuard = new JwtAuthGuard(this.reflector);
    const jwtServiceAccountAuthGuard = new JwtServiceAccountAuthGuard(
      this.reflector,
    );

    try {
      return jwtAuthGuard.canActivate(context); // Attempt to activate the jwtAuthGuard
    } catch {
      // If the jwtAuthGuard fails, attempt to activate the jwtServiceAccountAuthGuard
      return jwtServiceAccountAuthGuard.canActivate(context);
    }
  }
}
