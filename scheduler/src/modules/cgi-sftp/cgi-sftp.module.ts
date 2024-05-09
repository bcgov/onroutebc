import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { CgiSftpController } from './cgi-sftp.controller';

@Module({
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
})
export class CgiSftpModule {}
