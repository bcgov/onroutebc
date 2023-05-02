import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitProfile } from './profile/permit.profile';
import { PermitData } from './entities/permit-data.entity';
import { Permit } from './entities/permit.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationProfile } from './profile/application.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Permit, PermitData])],
  controllers: [PermitController, ApplicationController],
  providers: [
    PermitService,
    ApplicationService,
    PermitProfile,
    ApplicationProfile,
  ],
})
export class PermitModule {}
