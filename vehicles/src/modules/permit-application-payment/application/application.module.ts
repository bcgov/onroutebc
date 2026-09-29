import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyApplicationController } from './company-application.controller';
import { ApplicationService } from './application.service';
import { ApplicationProfile } from './profile/application.profile';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { PaymentModule } from '@modules/permit-application-payment/payment/payment.module';
import { PermitData } from '@modules/permit-application-payment/permit/entities/permit-data.entity';
import { PermitType } from '@modules/permit-application-payment/permit/entities/permit-type.entity';
import { Permit } from '@modules/permit-application-payment/permit/entities/permit.entity';
import { PermitReceiptDocumentModule } from '@modules/permit-application-payment/permit-receipt-document/permit-receipt-document.module';
import { ApplicationController } from './application.controller';
import { CaseManagementModule } from '@modules/case-management/case-management.module';
import { CompanyApplicationQueueController } from './company-application-queue.controller';
import { PermitLoa } from './entities/permit-loa.entity';
import { LoaDetail } from '@modules/special-auth/entities/loa-detail.entity';
import { PolicyModule } from '@modules/policy/policy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permit,
      PermitData,
      PermitType,
      PermitApplicationOrigin,
      PermitApprovalSource,
      PermitLoa,
      LoaDetail,
    ]),
    PaymentModule,
    PermitReceiptDocumentModule,
    CaseManagementModule,
    PolicyModule,
  ],
  controllers: [
    CompanyApplicationQueueController,
    CompanyApplicationController,
    ApplicationController,
  ],
  providers: [ApplicationService, ApplicationProfile],
  exports: [ApplicationService],
})
export class ApplicationModule {}
