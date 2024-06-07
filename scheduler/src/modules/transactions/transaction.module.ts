import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
// import { TransactionController } from './transaction.controller';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { TransactionRepository } from './transaction.repository';
import { ORBC_CFSTransactionDetailRepository } from './transaction-detail.repository';
import { ORBCTransactionRepositoryProvider, ORBC_CFSTransactionDetailRepositoryProvider } from './provider';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, ORBC_CFSTransactionDetail, TransactionRepository])],
  providers: [TransactionService, 
    ORBC_CFSTransactionDetailRepository,
    ORBC_CFSTransactionDetailRepositoryProvider,
    ORBCTransactionRepositoryProvider
  ],
  controllers: [],
  exports: [TransactionService],
})
export class TransactionModule {}
