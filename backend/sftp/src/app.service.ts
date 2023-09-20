import { Injectable, Logger } from '@nestjs/common';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class AppService {
  private readonly logger: Logger;
  constructor(private readonly sftpClient: SftpClientService) {
    this.logger = new Logger();
  }
  getHello(): string {
    return 'Hello World!';
  }
 /* async download(): Promise<string> {
    try {
      console.log('current working directory: ', process.cwd());
      // await this.sftpClient.upload('test6.txt','/upload/test6.txt');
      const a = await this.sftpClient.download('/upload/test6.txt', 'test.txt');
      console.log(a);
      return String(a);
    } catch (err) {
      console.log('Error Occured: ', err);
    }
    return '';
  }*/
}
