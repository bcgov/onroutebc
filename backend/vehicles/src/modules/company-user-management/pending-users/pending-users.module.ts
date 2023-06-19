import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUser } from './entities/pending-user.entity';
import { PendingUsersController } from './pending-users.controller';
import { PendingUsersService } from './pending-users.service';
import { PendingUsersProfile } from './profiles/pending-user.profile';
import { PendingIdirUser } from './entities/pending-idir-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PendingUser, PendingIdirUser])],
  controllers: [PendingUsersController],
  providers: [PendingUsersService, PendingUsersProfile],
  exports: [PendingUsersService],
})
export class PendingUsersModule {}
