import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { SftpModule } from 'nest-sftp';
import { CgiSftpController } from './cgi-sftp.controller';

@Module({
  imports: [
    SftpModule.forRoot(
      {
        host: process.env.CFS_SFTP_HOST,
        port: Number(process.env.CFS_SFTP_PORT),
        username: process.env.CFS_SFTP_USERNAME,
        privateKey: process.env.CFS_PRIVATE_KEY,
        passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
        debug: console.log,
      },
      false,
    ),
  ],
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
})
export class CgiSftpModule {}
