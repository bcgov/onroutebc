import { SFTPWrapper } from 'ssh2';
import * as Client from 'ssh2-sftp-client';

export const getSFTPConnection = async (): Promise<SFTPWrapper> => {
  const sftp = new Client('onRouteBC_V2');
  const sftpWrapper: SFTPWrapper = await sftp.connect({
    host: process.env.CFS_SFTP_HOST,
    port: Number(process.env.CFS_SFTP_PORT),
    privateKey: process.env.CFS_PRIVATE_KEY,
    passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
    username: process.env.CFS_SFTP_USERNAME,
  });
  return sftpWrapper;
};
