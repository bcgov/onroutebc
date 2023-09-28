import 'dotenv/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { SftpModule } from 'nest-sftp';
import { ConfigModule } from '@nestjs/config';

import * as path from 'path';

const envPath = path.resolve(process.cwd() + '/../../');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${envPath}/.env` }),
      SftpModule.forRoot(
    {
      host: process.env.CFS_SFTP_HOST,
      port: process.env.CFS_SFTP_PORT,
      username: process.env.CFS_SFTP_USERNAME,
      //password: 'pass',
      privateKey: process.env.CFS_PRIVATE_KEY,
      passphrase: process.env.CFS_PASSPHRASE, 
    },
    false,
  ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
