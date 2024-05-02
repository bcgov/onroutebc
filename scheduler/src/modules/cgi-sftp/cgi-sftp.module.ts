import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { CgiSftpController } from './cgi-sftp.controller';
import { SftpModule } from 'nest-sftp';

@Module({
  imports: [
    SftpModule.forRoot(
      {
        host: process.env.CFS_SFTP_HOST,
        port: process.env.CFS_SFTP_PORT,
        username: process.env.CFS_SFTP_USERNAME,
        privateKey: process.env.CFS_PRIVATE_KEY,
        passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
      },
      false,
    ),
  ],
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
})
export class CgiSftpModule {}
