import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  upload() {
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const files: string[] = [];
    const localPath = '/tmp';
    const remotePath = './data/';
    fs.readdirSync(localPath).forEach((file) => {
      if (fs.statSync(path.join(localPath, file)).isFile()) files.push(file);
    });
    files.forEach((file) => {
      const data = fs.createReadStream(path.join(localPath, file));
      sftp
        .connect(connectionInfo)
        .then(() => {
          return sftp.put(data, remotePath + file);
        })
        .then(() => {
          return sftp.end();
        })
        .then(() => {
          return fs.rmSync(path.join(localPath, file));
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
