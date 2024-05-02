import { Controller, Get, Query } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('cgi-sftp')
export class CgiSftpController {
  constructor(private readonly cgiSftpService: CgiSftpService) {}

  @Get()
  @ApiQuery({ name: 'fileName', required: true })
  @ApiQuery({ name: 'filePath', required: true })
  async upload(
    @Query('fileName') fileName: string,
    @Query('filePath') filePath: string,
  ) {
    return await this.cgiSftpService.uploadToSFTP(fileName, filePath);
  }
}
