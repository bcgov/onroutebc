import * as Client from 'ssh2-sftp-client';

export const getSFTPConnectionInfo = (): Client.ConnectOptions => {
  const host = process.env.CFS_SFTP_HOST;
  const port = Number(process.env.CFS_SFTP_PORT);
  const username = process.env.CFS_SFTP_USERNAME;
  const privateKey = process.env.CFS_PRIVATE_KEY;
  const passphrase = process.env.CFS_PRIVATE_KEY_PASSPHRASE;
  const connectionOptions = {
    host: host,
    port: port,
    username: username,
    privateKey: privateKey,
    passphrase: passphrase,
  };
  return connectionOptions;
};
