import { Injectable, Logger, UploadedFile } from '@nestjs/common';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class CgiSftpService {
  private readonly logger: Logger;
  constructor(private readonly sftpClient: SftpClientService) {
    this.logger = new Logger();
  }

  async list() {
    console.log(await this.sftpClient.realPath('./data'));
    console.log(await this.sftpClient.list('./data'));
    return 'hello  ';
  }

  async upload(file: Express.Multer.File) {
    console.log(await this.sftpClient.upload(file.buffer, './data'));
  }
}
