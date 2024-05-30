import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

import { generate } from 'src/helper/generator.helper';

import { CgiSftpService } from '../cgi-sftp/cgi-sftp.service'


@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = this.transactionService.getTransactionDetails();
    const result: { file: Express.Multer.File, fileName: string } | null = await generate(await transactions);

    // upload cgi file
    const cgiSftpService: CgiSftpService = new CgiSftpService();
    const fileData: Express.Multer.File = result.file; 
    const fileName: string = result.fileName;
    cgiSftpService.upload(fileData, fileName);

    // return transactions;
    return transactions;
  }
}
