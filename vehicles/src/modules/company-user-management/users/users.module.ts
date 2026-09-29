import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '@modules/company-user-management/company/company.module';
import { PendingUsersModule } from '@modules/company-user-management/pending-users/pending-users.module';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUser } from './entities/company-user.entity';
import { User } from './entities/user.entity';
import { UsersProfile } from './profiles/user.profile';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PendingIdirUser } from '@modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { PendingIdirUsersModule } from '@modules/company-user-management/pending-idir-users/pending-idir-users.module';
import { Login } from './entities/login.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CompanyUser, PendingIdirUser, Login]),
    PendingUsersModule,
    PendingIdirUsersModule,
    CompanyModule,
  ],
  controllers: [UsersController, CompanyUsersController],
  providers: [UsersService, UsersProfile],
  exports: [UsersService],
})
export class UsersModule {}
