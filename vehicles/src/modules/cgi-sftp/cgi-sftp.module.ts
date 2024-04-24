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
        b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABC/PmR4Pu
        1h52p1K4JrRttiAAAAEAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIHoMPb7P9MSB3SGd
        rsUOqzro6NZ8Q8cT73NrCC2bm7gZAAAAoDTz01E7tfEqGAG0hU9A/ZhoEfKmopH/USXpQs
        S+qxxTPdgxhfO+p4hbLySFB8/4CYuRaKROiTURbjJo1pRUcVS4deEsgyUDdwLlQpshhBeS
        NC1S3VZq6NaTei83x4aqA4dVkRF0aLsnG7IqJSUuhATcrhN94veKjyeEeAAjzJI8XpiJj0
        uvbkwilrUZzjYrB4EsDyHqPHla2zj3XoeUYuI=
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
