import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionDetail } from './transaction-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionDetail])],
  providers: [TransactionService],
  controllers: [],
  exports: [TransactionService],
})
export class TransactionModule {}
