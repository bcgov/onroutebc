import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
<<<<<<< HEAD
import { CgiSftpController } from './cgi-sftp.controller';

@Module({
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
=======

@Module({
  providers: [CgiSftpService],
>>>>>>> main
})
export class CgiSftpModule {}
