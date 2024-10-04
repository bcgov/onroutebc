import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/common/helper/sftp.helper';
import Client from 'ssh2-sftp-client';


@Injectable()
export class CgiSftpService {
  private readonly logger = new Logger(CgiSftpService.name);

  async upload(fileData: Express.Multer.File, fileName: string) {
    const sftp: Client = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = process.env.CFS_REMOTE_PATH; //Remote CFS Path

    try {
      await sftp.connect(connectionInfo);
    } catch (error) {
      this.logger.error('Cannot connect to sftp.');
      this.logger.error(error);
    }
    try {
      const res = sftp.put(fileData.buffer, remotePath + fileName);
      return res;
    } catch (error) {
      this.logger.error('Failed to send file via SFTP.');
      this.logger.error(error);
    } finally {
      this.logger.log('closing connection');
      void sftp.end();
    }
  }
}
