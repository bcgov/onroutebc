import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, ORBC_CFSTransactionDetail])],
  providers: [TransactionService],
  controllers: [],
  exports: [TransactionService],
})
export class TransactionModule {}
