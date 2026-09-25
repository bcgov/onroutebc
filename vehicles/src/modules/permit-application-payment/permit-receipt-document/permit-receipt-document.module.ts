import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from '@modules/permit-application-payment/permit/entities/permit.entity';
import { PermitReceiptDocumentService } from './permit-receipt-document.service';
import { PaymentModule } from '@modules/permit-application-payment/payment/payment.module';
import { PolicyModule } from '@modules/policy/policy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permit]), PaymentModule, PolicyModule],
  providers: [PermitReceiptDocumentService],
  exports: [PermitReceiptDocumentService],
})
export class PermitReceiptDocumentModule {}
