import { Injectable } from '@nestjs/common';
import { Client } from 'basic-ftp';
import * as fs from 'fs';

@Injectable()
export class GarmsService {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async ftpsFile(): Promise<string> {
    try {
      // Connect to FTP server
      await this.connectToFtp();
      console.log('ftp cliet: ', this.client);
      console.log('directory',fs.Dir);
      await this.client.uploadFrom('Hello world', 'GARMD.GA4701.WS.BATCH(+1)');
      console.log('Current working directory', await this.client.pwd());
      await this.client.cd('GARMSD.GA4701.WS.BATCH');
      console.log('pwd: ', await this.client.pwd());
      console.log('list: ', await this.client.list());
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
        host: 'bcsc01.gov.bc.ca', // Replace with your FTPS server host
        user: 'PI74967', // Your username for the FTPS server
        password: 'dummypwd', // Your password
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
}
