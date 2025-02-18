import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import FTPS from 'ftps';

@Injectable()
export class GarmsService {
  private readonly logger = new Logger(GarmsService.name);

  upload() {
    const options: FTPS.FTPOptions = {
      host: process.env.GARMS_HOST, 
      username: process.env.GARMS_USER, 
      password: process.env.GARMS_PWD, 
      // additinal settings for lftp command. 
      additionalLftpCommands:
        'set cache:enable no;set ftp:passive-mode on;set ftp:use-size no;set ftp:ssl-protect-data yes;set ftp:ssl-force yes;set ftps:initial-prot "P";set net:connection-limit 1;set net:max-retries 1;debug 3;', // Additional commands to pass to lftp, splitted by ';'
    };
    const ftps: FTPS = new FTPS(options);
    try {
      const remoteFilePath = 'GARMD.GA4701.WS.BATCH(+1)';
      const localFilePath = '/tmp/orbctest.txt';
      ftps.raw('quote SITE LRecl=140');
      ftps.pwd().exec(console.log);
      ftps.raw(`put -a ${localFilePath} -o "'${remoteFilePath}'"`);
      ftps.pwd().exec(console.log);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    finally{
      ftps.raw('quit');
    }
  }
}
