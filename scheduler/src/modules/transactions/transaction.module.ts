import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CfsTransactionDetail } from './transaction-detail.entity';
import { Holiday } from './holiday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, CfsTransactionDetail, Holiday])],
  providers: [TransactionService],
  controllers: [],
  exports: [TransactionService],
})
export class TransactionModule {}
