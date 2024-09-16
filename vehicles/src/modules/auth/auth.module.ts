import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { UsersModule } from '../company-user-management/users/users.module';
import { PendingUsersModule } from '../company-user-management/pending-users/pending-users.module';
import { PermissionsGuard } from '../../common/guard/permissions.guard';
import { JwtServiceAccountStrategy } from './jwt-service-account.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    PendingUsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtServiceAccountStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
