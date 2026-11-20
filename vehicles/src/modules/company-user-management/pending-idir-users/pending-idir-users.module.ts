import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingIdirUsersProfile } from './profiles/pending-idir-user.profile';
import { PendingIdirUser } from './entities/pending-idir-user.entity';
import { PendingIdirUsersController } from './pending-idir-users.controller';
import { PendingIdirUsersService } from './pending-idir-users.service';
import { UserManagmentActivityModule } from '@modules/company-user-management/user-management-activity/user-management-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingIdirUser]),
    UserManagmentActivityModule,
  ],
  controllers: [PendingIdirUsersController],
  providers: [PendingIdirUsersService, PendingIdirUsersProfile],
  exports: [PendingIdirUsersService],
})
export class PendingIdirUsersModule {}
