import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  upload(fileData: Express.Multer.File, fileName: string) {
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = process.env.CFS_REMOTE_PATH;
    sftp
      .connect(connectionInfo)
      .then(() => {
        console.log('writing file', remotePath + fileName);
        return sftp.put(fileData.buffer, remotePath + fileName);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        console.log('closing connection');
        void sftp.end();
      });
  }
}
