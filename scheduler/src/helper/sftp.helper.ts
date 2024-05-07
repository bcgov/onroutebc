import { SFTPWrapper } from 'ssh2';
import * as Client from 'ssh2-sftp-client';

export const config = {
  host: process.env.CFS_SFTP_HOST,
  port: Number(process.env.CFS_SFTP_PORT),
  privateKey: process.env.CFS_PRIVATE_KEY,
  passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
  username: process.env.CFS_SFTP_USERNAME,
};

export const getSFTPConnection = async (): Promise<SFTPWrapper> => {
  const sftp = new Client();
  const connectionInfo: Client.ConnectOptions = getSFTPConnectionInfo();

  const sftpWrapper: SFTPWrapper = await sftp.connect(connectionInfo);
  return sftpWrapper;
};

export const getSFTPConnectionInfo = (): Client.ConnectOptions => {
  const host = process.env.CFS_SFTP_HOST;
  const port = Number(process.env.CFS_SFTP_PORT);
  const connectionOptions: Client.ConnectOptions = { host, port };

  const username = process.env.CFS_SFTP_USERNAME;
  const privateKey = process.env.CFS_PRIVATE_KEY;
  const passphrase = process.env.CFS_PRIVATE_KEY_PASSPHRASE;
  connectionOptions.username = username;
  connectionOptions.privateKey = privateKey;
  connectionOptions.passphrase = passphrase;
  return connectionOptions;
};
