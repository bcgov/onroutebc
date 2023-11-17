import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionProfile } from './profile/transaction.profile';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { Receipt } from './entities/receipt.entity';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      PermitTransaction,
      Receipt,
      PaymentType,
      PaymentMethod,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, TransactionProfile],
  exports: [PaymentService],
})
export class PaymentModule {}
