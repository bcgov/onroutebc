import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyApplicationController } from './company-application.controller';
import { ApplicationService } from './application.service';
import { ApplicationProfile } from './profile/application.profile';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { PaymentModule } from '../payment/payment.module';
import { PermitData } from '../permit/entities/permit-data.entity';
import { PermitType } from '../permit/entities/permit-type.entity';
import { Permit } from '../permit/entities/permit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permit,
      PermitData,
      PermitType,
      PermitApplicationOrigin,
      PermitApprovalSource,
    ]),
    PaymentModule,
  ],
  controllers: [CompanyApplicationController],
  providers: [ApplicationService, ApplicationProfile],
  exports: [ApplicationService],
})
export class ApplicationModule {}
