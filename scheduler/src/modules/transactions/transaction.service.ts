import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { ORBC_CFSTransactionDetailRepository } from './transaction-detail.repository';
import { TransactionRepository } from './transaction.repository';

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
    const transactions = await this.transactionRepository.createQueryBuilder('transaction')
    // .innerJoinAndSelect('transaction.detail', 'detail')
    .innerJoinAndSelect('ORBC_CFSTransactionDetail', 'detail', 'transaction.TRANSACTION_ID = detail.TRANSACTION_ID')
    .where('detail.CFS_FILE_STATUS_TYPE = :status', { status: 'READY' })
    .getMany();

  if (transactions.length > 0) {
    console.log(transactions);
    return transactions;
  } else {
    console.log('No transactions found with status READY');
    return [];
  }
  }

  async updateCfsFileStatusType(): Promise<void> {
    const transactionDetails: ORBC_CFSTransactionDetail[] = await this.cfsTransactionDetailRepo.find({ where: { CFS_FILE_STATUS_TYPE: 'READY' } });
    // Update the CFS_FILE_STATUS_TYPE to "SENT" for all found transactionDetails
    const updatedTransactionDetails: ORBC_CFSTransactionDetail[] = transactionDetails.map(detail => {
      detail.CFS_FILE_STATUS_TYPE = 'SENT';
      return detail;
    });

    // Save the updated transactionDetails to the database
    try {
      await this.cfsTransactionDetailRepo.save(updatedTransactionDetails);
      console.log(`Updated transaction details`);
    } catch (error) {
      console.error('Error updating transaction details:', error);
      throw error; // Optional: rethrow the error to propagate it
    }
  }

}
