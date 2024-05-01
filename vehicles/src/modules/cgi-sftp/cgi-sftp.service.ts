import { Injectable } from '@nestjs/common';
import * as Client from 'ssh2-sftp-client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

@Injectable()
export class CgiSftpService {

  upload(file: Express.Multer.File) {
    const sftp = new Client();
       sftp.connect({
        host: process.env.CFS_SFTP_HOST,
        port: Number(process.env.CFS_SFTP_PORT),
        privateKey: process.env.CFS_PRIVATE_KEY,
        passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
        username: process.env.CFS_SFTP_USERNAME,
      }).then(async () => { 
        console.log('current working directory ',await sftp.cwd())
        console.log('list current working directory ',await sftp.list('.'))
        console.log('list data folder ',await sftp.list('./data'))
        const filePath = join(__dirname,'../../../../tmp','abc.txt');
        console.log('file path ',filePath)
        console.log ('writing file ',await writeFile(filePath, file.buffer, 'utf-8'));
        console.log('put file ',await sftp.put(`${filePath}`,'./data/test.txt'))
        console.log(file.buffer);
      })

      .then(() => {
        return sftp.end();
      })
      .catch(err => {
        console.error(err);
      });

  }
}
