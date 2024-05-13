
import { generate} from 'src/helper/generator.helper'
import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  async upload(fileData: Express.Multer.File, fileName: string) {
    // Generate cig files
    await this.generateCgi();
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = './data/';
    sftp
      .connect(connectionInfo)
      .then(() => {
        console.log('writing file', remotePath + fileName);
        return sftp.put(fileData.buffer, remotePath + fileName);
      })
      .then(() => {
        console.log('closing connection');
        return sftp.end();
      })
      .catch((err) => {
        console.log('caught error');
        console.log(err);
      });
  }

  async generateCgi() {
    console.log('cgi file generating...');
    await generate();
  }
}
