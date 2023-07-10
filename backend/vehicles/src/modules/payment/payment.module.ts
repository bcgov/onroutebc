import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionProfile } from './profile/transaction.profile';
import { PermitTransactionProfile } from './profile/permit-transaction.profile';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { PermitModule } from '../permit/permit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, PermitTransaction]),
    PermitModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, TransactionProfile, PermitTransactionProfile],
  exports: [PaymentService],
})
export class PaymentModule {}
