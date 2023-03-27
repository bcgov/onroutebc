import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { RolesGuard } from 'src/guard/roles.guard';
import { CompanyModule } from '../company/company.module';
import { PendingUsersModule } from '../pending-users/pending-users.module';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUser } from './entities/company-user.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UsersProfile } from './profiles/user.profile';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CompanyUser, Role]),
    PendingUsersModule,
    AbilityModule,
    forwardRef(() => CompanyModule),
  ],
  controllers: [UsersController, CompanyUsersController],
  providers: [
    UsersService,
    UsersProfile,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [UsersService],
})
export class UsersModule {}
