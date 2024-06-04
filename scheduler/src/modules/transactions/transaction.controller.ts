import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

import { generate } from 'src/helper/generator.helper';

// import { CgiSftpService } from '../cgi-sftp/cgi-sftp.service'


@Controller('cgi-files')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = this.transactionService.getTransactionDetails();
    await generate(await transactions);

    // update CFS_FILE_STATUS_TYPE
    await this.transactionService.updateCfsFileStatusType();


    // return transactions;
    return transactions;
  }
}
