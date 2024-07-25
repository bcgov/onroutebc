import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/common/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  private readonly logger = new Logger(CgiSftpService.name);

  upload(fileData: Express.Multer.File, fileName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const sftp = new Client();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const remotePath = process.env.CFS_REMOTE_PATH; //Remote CFS Path

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    sftp
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .connect(connectionInfo)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then(() => {
        this.logger.log(`writing file ${remotePath}${fileName}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return sftp.put(fileData.buffer, remotePath + fileName);
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(err);
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .finally(() => {
        this.logger.log('closing connection');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void sftp.end();
      });
  }
}
