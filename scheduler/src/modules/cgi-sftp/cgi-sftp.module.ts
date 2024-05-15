import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';

@Module({
  providers: [CgiSftpService],
})
export class CgiSftpModule {}
