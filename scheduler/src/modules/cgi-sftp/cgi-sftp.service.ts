import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as fs from 'fs';
import * as path from 'path';
import * as Client from 'ssh2-sftp-client';
import { generate} from 'src/helper/generator.helper';

@Injectable()
export class CgiSftpService {
  async upload() {
    // Generate cig files
    await this.generateCgi();
    const localPath = '/tmp';
    const remotePath = './data/';
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const files: string[] = [];
    fs.readdirSync(localPath).forEach((file) => {
      if (fs.statSync(path.join(localPath, file)).isFile()) files.push(file);
    });
    files.forEach((file) => {
      console.log('file::',file);
      const data = fs.createReadStream(path.join(localPath, file));
      console.log('filepath::',path.join(localPath, file))
      sftp
        .connect(connectionInfo)
        .then(() => {
          return sftp.put(data, remotePath + file);
        })
        .then(() => {
          return sftp.end();
        })
        .then(() => {
          fs.rmSync(path.join(localPath, file), { force: true });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async generateCgi() {
    console.log('cgi file generating...');
    await generate();
  }
}
