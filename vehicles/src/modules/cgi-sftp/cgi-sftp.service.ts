import { Injectable, Logger } from '@nestjs/common';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class CgiSftpService {
  private readonly logger: Logger;
  constructor(private readonly sftpClient: SftpClientService) {
    this.logger = new Logger();
  }

  async list() {
    console.log(await this.sftpClient.realPath('.'));
    console.log(await this.sftpClient.list('.'));
    return 'hello';
  }
}
