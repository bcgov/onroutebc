import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitProfile } from './profile/permit.profile';
import { PermitData } from './entities/permit-data.entity';
import { Permit } from './entities/permit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permit, PermitData])],
  controllers: [PermitController],
  providers: [PermitService, PermitProfile],
})
export class PermitModule {}
