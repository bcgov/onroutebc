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

@ApiBearerAuth()
@Controller('cgi-sftp')
export class CgiSftpController {
  constructor(private readonly cgiSftpService: CgiSftpService) {}

  @Post()
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
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('fileName') fileName: string,
  ) {
    await this.cgiSftpService.upload(file, fileName);
  }
}