<<<<<<< HEAD

// import { generate} from 'src/helper/generator.helper'
import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

// import { MyService } from 'src/helper/myservice';

// import { TransactionService } from '../transactions/transaction.service';

@Injectable()
export class CgiSftpService {
  upload(fileData: Express.Multer.File, fileName: string) {
    // Generate cig files

    // await myservice.fetchTransactions();
    // await this.generateCgi();
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

  // async generateCgi() {
  //   console.log('cgi file generating...');

  //   await generate();
  // }
=======
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
>>>>>>> main
}
