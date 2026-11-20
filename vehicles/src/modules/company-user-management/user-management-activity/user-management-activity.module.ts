import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementActivity } from './entities/user-management-activity.entity';
import { UserManagmentActivityService } from './user-management-activity.service';
import { UserManagementActivityController } from './user-management-activity.controller';
import { UsersManagementActivityProfile } from './profiles/user-management-activity.profile';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagementActivity])],
  providers: [UserManagmentActivityService, UsersManagementActivityProfile],
  controllers: [UserManagementActivityController],
  exports: [UserManagmentActivityService],
})
export class UserManagmentActivityModule {}
