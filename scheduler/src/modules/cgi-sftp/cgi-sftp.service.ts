import { Injectable } from '@nestjs/common';
import { getSFTPConnectionInfo } from 'src/helper/sftp.helper';
<<<<<<< HEAD
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
=======
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class CgiSftpService {
  upload(fileData: Express.Multer.File, fileName: string) {
    const sftp = new Client();
    const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();
    console.log(connectionInfo);
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
>>>>>>> 915496a7e116a12017a90844599ce19fad7499ee
  }
}
