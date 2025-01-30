import { Injectable } from '@nestjs/common';
import { Client } from 'basic-ftp';
import * as FTPS from 'ftps';
import { exec } from 'child_process';

import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class GarmsService {
  private client: Client;


  constructor() {
    this.client = new Client();
    this.client.ftp.verbose = true;
  }

  async ftpsFile(): Promise<string> {
    try {
      console.log('GARMS HOST : ', process.env.GARMS_HOST);
      console.log('GARMS USER : ', process.env.GARMS_USER);
      console.log('GARMS PWD : ', process.env.GARMS_PWD);
      // Connect to FTP server
      await this.connectToFtp();
      console.log('Current working directory', await this.client.pwd());
      await this.client.cd('GARMSD.GA4701.WS.BATCH');
      console.log('pwd: ', await this.client.pwd());
      // await this.client.uploadFrom('Hello world', 'GARMD.GA4701.WS.BATCH(+1)');

      // Upload file
      // await this.client.uploadFrom(filePath, remotePath);
      // console.log(`File uploaded: ${filePath} -> ${remotePath}`);
    } catch (error) {
      console.error('Error uploading file', error);
      throw error;
    } finally {
      // Close the connection after uploading
      this.client.close();
    }
    return 'Vehicles Healthcheck!';
  }
  async connectToFtp() {
    try {
      await this.client.access({
        host: process.env.GARMS_HOST, // Replace with your FTPS server host
        user: process.env.GARMS_USER, // Your username for the FTPS server
        password: process.env.GARMS_PASSWROD, // Your password
        secure: true, // Enabling FTPS (SSL/TLS encryption)
        secureOptions: {
          rejectUnauthorized: false, // Depending on your certificate, this can be true or false
        },
      });
      console.log('Connected to FTPS server');
    } catch (error) {
      console.error('Error connecting to FTPS server', error);
      throw error;
    }
  }
  ftpsFile2() {
    console.log('file data from hello2: ', fs.readFileSync('./dist/orbctest.txt', 'utf-8'));
    const ftps = new FTPS({
      host: process.env.GARMS_HOST, // required
      username: process.env.GARMS_USER, // Optional. Use empty username for anonymous access.
      password: process.env.GARMS_PWD, // Required if username is not empty, except when requiresPassword: false
      // protocol is added on beginning of host, ex : sftp://domain.com in this case
      additionalLftpCommands:
        'set cache:enable no;set ftp:passive-mode on;set ftp:use-size no;set ftp:ssl-protect-data yes;set ftp:ssl-force yes;set ftps:initial-prot "P";set net:connection-limit 1;set net:max-retries 1;debug 3;', // Additional commands to pass to lftp, splitted by ';'
    });
        const remoteFilePath = 'GARMD.GA4701.WS.BATCH(+1)';
     const localFilePath = './dist/orbctest.txt'
    console.log('executing quote');
    ftps.raw('quote SITE LRecl=140')
    console.log('executed quote');
    ftps.pwd().exec(console.log);
    const remoteFile = "'GARMD.GA4701.WS.BATCH(+1)'";
    console.log('Remote file is: ',remoteFile)
    ftps.raw(`put -a ${localFilePath} -o "'${remoteFilePath}'"`);
    ftps.raw('quit')
    ftps.pwd().exec(console.log);
  }

  async ftpsFile3() {
    const execPromise = promisify(exec);
    try {
      const remoteFilePath = 'GARMD.GA4701.WS.BATCH(+1)';
     const localFilePath = './dist/orbctest.txt'
     const additionalParams = 'set cache:enable no;set ftp:passive-mode on;set ftp:use-size no;set ftp:ssl-protect-data yes;set ftp:ssl-force yes;set ftps:initial-prot P;set net:connection-limit 1;set net:max-retries 1;debug 5';

      // Construct the lftp command
      const command = `
      lftp -u ${process.env.GARMS_USER},${process.env.GARMS_PWD} ${process.env.GARMS_HOST} -e ${additionalParams} put -a ${localFilePath} -o "'${remoteFilePath}'"; quit;`

      // Execute the command using child_process
      const { stdout, stderr } = await execPromise(command);

      if (stderr) {
        throw new Error(`Error transferring file: ${stderr}`);
      }

      return stdout;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error(`File transfer failed: ${error.message}`);
    }
  }
}
