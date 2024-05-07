import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
import * as fs from 'fs';
import * as path from 'path';
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  upload() {
    const localPath = '/tmp';
    const remotePath = './data/';
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    const files: string[] = [];
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
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
