import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { SftpModule } from 'nest-sftp';
import { CgiSftpController } from './cgi-sftp.controller';

@Module({
  imports: [
    SftpModule.forRoot(
      {
        host: 'Trooper.cas.gov.bc.ca',
        port: 21,
        username: 'f3535t',
        privateKey: process.env.CFS_PRIVATE_KEY,
        passphrase: 'Amsterdam!99',
        debug: console.log,
      },
      false,
    ),
  ],
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
})
export class CgiSftpModule {}
