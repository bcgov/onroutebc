import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

import { generate } from 'src/helper/generator.helper';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = this.transactionService.getAllTransactions();

    // generate cgi files
    await generate(await transactions);


    return transactions;
  }
}
