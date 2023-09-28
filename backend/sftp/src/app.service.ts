import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class AppService {
  constructor(private readonly sftpClient: SftpClientService) {
  }
  getHello(): string {
    return 'Hello World!';
  }
 async download(): Promise<string> {
    try {
      console.log('current working directory: ', process.cwd());
      await this.sftpClient.upload('test6.txt','/upload/test6.txt');
      const a = await this.sftpClient.download('/upload/test6.txt', 'test.txt');
      console.log(a);
      return String(a);
    } catch (err) {
      console.log('Error Occured: ', err);
    }
       return '';
  }
}
