import { Injectable } from '@nestjs/common';
import { SftpClientService } from 'nest-sftp';

@Injectable()
export class CgiSftpService {
  constructor(private readonly sftpClient: SftpClientService) {}
  async uploadToSFTP(filename: string, path: string) {
    const remoteFilePath: string = `./data/${filename}`;
    const localFilePath: string = `${path}/${filename}`;
    console.log('********************************************************************')
    console.log('Listing files::',this.sftpClient.list(path))
    console.log('********************************************************************')
    const uploadStatus = await this.sftpClient.upload(
      remoteFilePath,
      localFilePath,
    );
    return uploadStatus;
  }
}
