import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sftpConfig } from 'src/constant/sftp-config';
import { SFTPWrapper } from 'ssh2';
import * as Client from 'ssh2-sftp-client'


@Injectable()
export class CgiSftpService {
  private client: Client = new Client('onRouteBC_V2');
  async uploadToSFTP(filename: string, path: string, file: Express.Multer.File) {
    const remoteFilePath: string = `./data/${filename}`;
    const localFilePath: string = `${path}/${filename}`;
    console.log('********************************************************************')
    const sftpWrapper: SFTPWrapper = await this.client.connect(sftpConfig)
    try{
     sftpWrapper.writeFile(remoteFilePath,file.buffer);
     sftpWrapper.writeFile(remoteFilePath,localFilePath);
     console.log('lst file::',sftpWrapper.readdir('./data',(err, files) => {
      files.forEach( file => {
          console.log(file);
      });
  }))
    }catch(error){
      throw new InternalServerErrorException(error)
    }finally{
     await this.client.end();
    }
    console.log('********************************************************************')
    
    return  ('uploadStatus' + remoteFilePath + localFilePath);
  }
}
