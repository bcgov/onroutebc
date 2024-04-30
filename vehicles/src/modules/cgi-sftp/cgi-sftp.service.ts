import { Injectable, Logger } from '@nestjs/common';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class CgiSftpService {
  private readonly logger: Logger;
  constructor(private readonly sftpClient: SftpClientService) {
    this.logger = new Logger();
  }

  async list() {
    console.log('Real Path ',await this.sftpClient.realPath('.'));
    console.log('Listing ',await this.sftpClient.list('data'));
    return 'hello  ';
  }

  async upload(file: Express.Multer.File) {
    console.log(await this.sftpClient.upload('data', file.buffer.toString()));
  }
}
