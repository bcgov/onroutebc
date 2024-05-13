<<<<<<< HEAD
import { Controller, Post } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth } from '@nestjs/swagger';
=======
import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
>>>>>>> 915496a7e116a12017a90844599ce19fad7499ee

@ApiBearerAuth()
@Controller('cgi-sftp')
export class CgiSftpController {
  constructor(private readonly cgiSftpService: CgiSftpService) {}

  @Post()
<<<<<<< HEAD
  upload() {
    this.cgiSftpService.upload();
=======
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'fileName', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('fileName') fileName: string,
  ) {
    this.cgiSftpService.upload(file, fileName);
>>>>>>> 915496a7e116a12017a90844599ce19fad7499ee
  }
}
