import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSFTPConnection } from 'src/helper/sftp.helper';
import { SFTPWrapper } from 'ssh2';

@Injectable()
export class CgiSftpService {
  async uploadToSFTP(filename: string, file: Express.Multer.File) {
    const sftpWrapper: SFTPWrapper = await getSFTPConnection();
    try {
      sftpWrapper.fastPut(`/tmp/${filename}`,`./data/${filename}`, (err) => {
        throw new InternalServerErrorException(err);
      });
      console.log(
        sftpWrapper.readdir('./data', (err, files) => {
          files.forEach((file) => {
            console.log(file.filename);
          });
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    } finally {
      sftpWrapper.end();
    }
  }
}
