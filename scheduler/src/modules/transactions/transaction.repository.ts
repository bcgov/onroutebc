import { EntityRepository, In, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    async getAllTransactions(): Promise<Transaction[]> {
        return this.find();
      }

      async findTransactionsByIds(transactionIds: number[]): Promise<Transaction[]> {
        return this.find({ where: { TRANSACTION_ID: In(transactionIds) } });
    }
}
