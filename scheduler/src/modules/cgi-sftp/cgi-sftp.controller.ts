import { Controller, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('cgi-sftp')
export class CgiSftpController {
  constructor(private readonly cgiSftpService: CgiSftpService) {}

  @Get()
  @ApiQuery({ name: 'fileName', required: true })
  @ApiQuery({ name: 'filePath', required: true })
  @UseInterceptors(FileInterceptor('file'))

  async upload(
    @Query('fileName') fileName: string,
    @Query('filePath') filePath: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.cgiSftpService.uploadToSFTP(fileName, filePath, file);
  }
}
