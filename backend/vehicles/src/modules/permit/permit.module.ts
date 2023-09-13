import { Module} from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitProfile } from './profile/permit.profile';
import { PermitData } from './entities/permit-data.entity';
import { Permit } from './entities/permit.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationProfile } from './profile/application.profile';
import { PermitType } from './entities/permit-type.entity';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { CompanyModule } from '../company-user-management/company/company.module';
import { Receipt } from '../payment/entities/receipt.entity';
import { Transaction } from '../payment/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permit,
      PermitData,
      PermitType,
      PermitApplicationOrigin,
      PermitApprovalSource,
      Transaction,
      Receipt,
    ]),
    CompanyModule,
  ],
  controllers: [PermitController, ApplicationController],
  providers: [
    PermitService,
    ApplicationService,
    PermitProfile,
    ApplicationProfile,
  ],
  exports: [PermitService, ApplicationService],
})
export class PermitModule {}
