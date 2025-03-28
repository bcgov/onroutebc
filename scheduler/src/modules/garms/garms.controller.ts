import { Controller, Get } from '@nestjs/common';
import { GarmsService } from './garms.service';

@Controller('file-transfer')
export class FileTransferController {
  constructor(private readonly fileTransferService: GarmsService) {}

  @Get('sftp')
  async transferFile() {
    try {
      const data = 'Test Date';
      const result = await this.fileTransferService.uploadFile(
        Buffer.from(data, 'ascii'),
        'test',
      );
      return { message: result };
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }

  @Get('cgi-sftp')
  async transferusingCgiFile() {
    try {
      const data = 'Test Date';
      const result = await this.fileTransferService.uploadFile(
        Buffer.from(data, 'ascii'),
        'test',
      );
      return { message: result };
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }

  @Get('ftp')
  transferFileFtp() {
    try {
      this.fileTransferService.executeSSHAndFTP('test');
    } catch (error) {
      return { message: 'Error during file transfer', error: error.message };
    }
  }
}
