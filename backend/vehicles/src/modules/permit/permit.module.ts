import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitProfile } from './profile/permit.profile';
import { PermitData } from './entities/permit-data.entity';
import { Permit } from './entities/permit.entity';
import { PermitApplicationController } from './permit-application.controller';
import { PermitApplicationService } from './permit-application.service';
import { PermitApplicationProfile } from './profile/permit-application.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Permit, PermitData])],
  controllers: [PermitController, PermitApplicationController],
  providers: [
    PermitService,
    PermitApplicationService,
    PermitProfile,
    PermitApplicationProfile,
  ],
})
export class PermitModule {}
