import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  upload(fileData: Express.Multer.File, fileName: string) {
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = './data/';
    sftp
      .connect(connectionInfo)
      .then(() => {
        return sftp.put(fileData.buffer, remotePath + fileName);
      })
      .then(() => {
        return sftp.end();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
