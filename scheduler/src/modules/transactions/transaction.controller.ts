import { Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('generate-file')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async upload() {
    return await this.transactionService.genterateCgifilesAndUpload();
  }
}
