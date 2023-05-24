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
import { PdfModule } from '../pdf/pdf.module';
import { PermitType } from './entities/permit-type.entity';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { DatabaseHelper } from 'src/common/helper/database.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permit,
      PermitData,
      PermitType,
      PermitApplicationOrigin,
      PermitApprovalSource,
    ]),
    PdfModule,
  ],
  controllers: [PermitController, ApplicationController],
  providers: [
    PermitService,
    ApplicationService,
    PermitProfile,
    ApplicationProfile,
    DatabaseHelper,
  ],
})
export class PermitModule {}
