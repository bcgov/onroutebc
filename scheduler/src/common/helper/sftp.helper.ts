import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as Client from 'ssh2-sftp-client';

export const getCgiSFTPConnectionInfo = () => {
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

export const getGarmSFTPConnectionInfo = () => {
  const host = process.env.GARMS_HOST;
  const port = 22;
  const username = process.env.GARMS_USER;
  const password = process.env.GARMS_PWD;
  const connectionOptions = {
    host: host,
    port: port,
    username: username,
    password: password,
  };
  return connectionOptions;
};

export const uploadToCFS = async (
  fileData: Express.Multer.File,
  fileName: string,
  logger: Logger,
) => {
  const sftp = new Client();
  const connectionInfo = getCgiSFTPConnectionInfo();
  const remotePath = process.env.CFS_REMOTE_PATH; //Remote CFS Path

  try {
    await sftp.connect(connectionInfo);
    logger.log(
      `Successfully connected to ${process.env.CFS_SFTP_HOST} via SFTP.`,
    );
  } catch (error) {
    logger.error('Cannot connect to sftp.');
    logger.error(error);
  }
  try {
    const res = await sftp.put(fileData.buffer, remotePath + fileName);
    logger.log(`Successfully sent file ${fileName} via SFTP.`);
    return res;
  } catch (error) {
    logger.error('Failed to send file via SFTP.');
    logger.error(error);
    throw new InternalServerErrorException('Failed to send file via SFTP.');
  } finally {
    logger.log('closing connection');
    void sftp.end();
  }
};

export const uploadToGarms = async (
  filePath: string,
  fileName: string,
  logger: Logger,
) => {
  const sftp = new Client();
  const connectionInfo = getGarmSFTPConnectionInfo();

  try {
    await sftp.connect(connectionInfo);
    logger.log(
      `Successfully connected to ${process.env.CFS_SFTP_HOST} via SFTP.`,
    );
  } catch (error) {
    logger.error('Cannot connect to sftp.');
    logger.error(error);
  }
  try {
    const res = await sftp.put(filePath+fileName, fileName,{writeStreamOptions: {encoding: 'ascii'}});
    logger.log(`Successfully sent file ${fileName} via SFTP.`);
    return res;
  } catch (error) {
    logger.error('Failed to send file via SFTP.');
    logger.error(error);
    throw new InternalServerErrorException('Failed to send file via SFTP.');
  } finally {
    logger.log('closing connection');
    void sftp.end();
  }
};
