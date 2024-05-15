import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  private readonly logger = new Logger(CgiSftpService.name);
  upload(fileData: Express.Multer.File, fileName: string) {
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = process.env.CFS_REMOTE_PATH;
    sftp
      .connect(connectionInfo)
      .then(() => {
        this.logger.log(`writing file ${remotePath}${fileName}`);
        return sftp.put(fileData.buffer, remotePath + fileName);
      })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        this.logger.log('closing connection');
        void sftp.end();
      });
  }
}
