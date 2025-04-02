import { Controller, Get } from '@nestjs/common';
import { GarmsService } from './garms.service';

@Controller('file-transfer')
export class FileTransferController {
  constructor(private readonly fileTransferService: GarmsService) {}

  @Get('transfer')
   transferFile(
  ) {
    try {
      const result =  this.fileTransferService.processCreditTransactions();
      return { message: result };
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }
}