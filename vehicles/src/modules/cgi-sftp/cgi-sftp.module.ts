import { Module } from '@nestjs/common';
import { CgiSftpService } from './cgi-sftp.service';
import { SftpModule } from 'nest-sftp';
import { CgiSftpController } from './cgi-sftp.controller';

@Module({
  imports: [
    SftpModule.forRoot(
      {
        host: "Trooper.cas.gov.bc.ca",
        port: "22",
        username: "f3535t",
        privateKey: `-----BEGIN OPENSSH PRIVATE KEY-----
        b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABBl5uVCkN
        DWVOdqkM5r8pTXAAAAEAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIHoMPb7P9MSB3SGd
        rsUOqzro6NZ8Q8cT73NrCC2bm7gZAAAAoGUsbGyviF9zKrQQYFSgny9j3T13GZ/A1G84dP
        4y4DKT4dDw3XG5SwkHsJISC8kCoXvVasUTqBkoDQV9ygUiMz/Vul3dK44RVnouTVSvME6V
        QXuscakbo7QxqOCDSN4/qepUtpKMlvyXWTWtSvWF7GNxebwRS4/WH4EAeVK8s0iOjOnvPu
        +IV3mVbIHSkky69UKUP6UdGLu6CG9TelFhNXw=
        -----END OPENSSH PRIVATE KEY-----`,
        passphrase: "Amsterdam!99",
        debug: console.log,
      },
      false,
    ),
  ],
  providers: [CgiSftpService],
  controllers: [CgiSftpController],
})
export class CgiSftpModule {}
