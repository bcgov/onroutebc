import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { CfsTransactionDetail } from '../common/entities/transaction-detail.entity';
import { Holiday } from './holiday.entity';
import { Transaction } from '../common/entities/transaction.entity';
import { PermitTransaction } from '../common/entities/permit-transaction.entity';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      CfsTransactionDetail,
      Holiday,
      PermitTransaction,
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
