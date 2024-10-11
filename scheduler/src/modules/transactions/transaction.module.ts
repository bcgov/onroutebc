import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { CfsTransactionDetail } from '../common/entities/transaction-detail.entity';
import { Holiday } from './holiday.entity';
import { Transaction } from '../common/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, CfsTransactionDetail, Holiday]),
  ],
  providers: [TransactionService],
  controllers: [],
  exports: [TransactionService],
})
export class TransactionModule {}
