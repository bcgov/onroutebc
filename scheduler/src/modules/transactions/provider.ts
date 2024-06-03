import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ORBC_CFSTransactionDetailRepository } from './transaction-detail.repository';
import { TransactionRepository } from '../transactions/transaction.repository';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { Transaction } from '../transactions/transaction.entity';

export const ORBC_CFSTransactionDetailRepositoryProvider: Provider = {
  provide: ORBC_CFSTransactionDetailRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ORBC_CFSTransactionDetail).extend(ORBC_CFSTransactionDetailRepository);
  },
  inject: [DataSource],
};

export const ORBCTransactionRepositoryProvider: Provider = {
  provide: TransactionRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(Transaction).extend(TransactionRepository);
  },
  inject: [DataSource],
};
