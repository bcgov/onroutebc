import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from '../permit/entities/permit.entity';
import { PermitReceiptDocumentService } from './permit-receipt-document.service';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permit]), PaymentModule],
  providers: [PermitReceiptDocumentService],
  exports: [PermitReceiptDocumentService],
})
export class PermitReceiptDocumentModule {}
