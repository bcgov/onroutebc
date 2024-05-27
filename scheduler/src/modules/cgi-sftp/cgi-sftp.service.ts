
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
}
