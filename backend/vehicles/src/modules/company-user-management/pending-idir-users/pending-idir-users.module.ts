import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingIdirUsersProfile } from './profiles/pending-idir-user.profile';
import { PendingIdirUser } from './entities/pending-idir-user.entity';
import { PendingIdirUsersController } from './pending-idir-users.controller';
import { PendingIdirUsersService } from './pending-idir-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([PendingIdirUser])],
  controllers: [PendingIdirUsersController],
  providers: [PendingIdirUsersService, PendingIdirUsersProfile],
  exports: [PendingIdirUsersService],
})
export class PendingIdirUsersModule {}
