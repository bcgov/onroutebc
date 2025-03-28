import { Controller, Get } from '@nestjs/common';
import { GarmsService } from './garms.service';
import {
  GARMS_CASH_FILE_LOCATION,
  GARMS_CASH_FILE_LRECL,
} from 'src/common/constants/garms.constant';

@Controller('file-transfer')
export class FileTransferController {
  constructor(private readonly fileTransferService: GarmsService) {}

  @Get('sftp')
  async transferFile() {
    try {
      const remoteFilePath = process.env.GARMS_ENV + GARMS_CASH_FILE_LOCATION;
      const recordLength = GARMS_CASH_FILE_LRECL;
      const result = await this.fileTransferService.uploadFile(
        '/tmp/',
        'GARMS_CASH',
        remoteFilePath,
        recordLength,
      );
      return { message: result };
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }

  @Get('create-cah-file')
  async createCashFile() {
    try {
      const result = await this.fileTransferService.processCashTransactions();
      return { message: result };
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }
}
