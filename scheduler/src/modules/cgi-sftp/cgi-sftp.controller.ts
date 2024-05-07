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
  @ApiQuery({ name: 'fileName', required: true })
  @ApiQuery({ name: 'filePath', required: true })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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
    @Query('fileName') fileName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.cgiSftpService.uploadToSFTP(fileName, file);
  }
}
