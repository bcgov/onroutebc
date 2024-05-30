import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { ORBC_CFSTransactionDetailRepository } from './transaction-detail.repository';
import { TransactionRepository } from './transaction.repository';
import { In } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly cfsTransactionDetailRepo: ORBC_CFSTransactionDetailRepository
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionDetails(): Promise<Transaction[]> {
    const transactionDetails: ORBC_CFSTransactionDetail[] = await this.cfsTransactionDetailRepo.find({ where: { CFS_FILE_STATUS_TYPE: 'READY' } });
    const transactionIds: number[] = transactionDetails.map(detail => detail.TRANSACTION_ID);
    if (transactionIds.length > 0) {
        const transactions = await this.transactionRepository.find({ where: { TRANSACTION_ID: In(transactionIds) } });
        console.log(transactions);
        return transactions;
    } else {
        console.log('No transactions found with status READY');
    }
  }

}
