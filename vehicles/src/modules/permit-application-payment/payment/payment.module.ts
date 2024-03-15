import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionProfile } from './profile/transaction.profile';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { Receipt } from './entities/receipt.entity';
import { PaymentCardType } from './entities/payment-card-type.entity';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { PaymentReportService } from './payment-report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      PermitTransaction,
      Receipt,
      PaymentCardType,
      PaymentMethodType,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, TransactionProfile, PaymentReportService],
  exports: [PaymentService],
})
export class PaymentModule {}
