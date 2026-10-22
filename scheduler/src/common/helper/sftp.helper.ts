import { InternalServerErrorException, Logger } from '@nestjs/common';
import Client from 'ssh2-sftp-client';
import { GARMS_LOCAL_FILE_PATH } from '@common/constants/garms.constant';
import { describeError } from './error.helper';

export const getCgiSFTPConnectionInfo = (): Client.ConnectOptions => {
  const host = process.env.CFS_SFTP_HOST;
  const port = Number(process.env.CFS_SFTP_PORT);
  const username = process.env.CFS_SFTP_USERNAME;
  const privateKey = process.env.CFS_PRIVATE_KEY;
  const passphrase = process.env.CFS_PRIVATE_KEY_PASSPHRASE;
  const connectionOptions: Client.ConnectOptions = {
    host: host,
    port: port,
    username: username,
    privateKey: privateKey,
    passphrase: passphrase,
  };
  return connectionOptions;
};

export const getGarmSFTPConnectionInfo = (): Client.ConnectOptions => {
  const host = process.env.GARMS_HOST;
  const port = 22;
  const username = process.env.GARMS_USER;
  const password = process.env.GARMS_PWD;
  const connectionOptions: Client.ConnectOptions = {
    host: host,
    port: port,
    username: username,
    password: password,
  };
  return connectionOptions;
};

export const getBpiSFTPConnectionInfo = (): Client.ConnectOptions => {
  const host = process.env.BPI_SFTP_HOST;
  const port = Number(process.env.BPI_SFTP_PORT);
  const username = process.env.BPI_SFTP_USERNAME;
  const privateKey = process.env.BPI_PRIVATE_KEY;
  //const passphrase = process.env.CFS_PRIVATE_KEY_PASSPHRASE;
  const connectionOptions: Client.ConnectOptions = {
    host: host,
    port: port,
    username: username,
    privateKey: privateKey,
  };
  return connectionOptions;
};

export const connectToSftp = async (
  logger: Logger,
  connectInfo: Client.ConnectOptions,
): Promise<Client> => {
  const sftp = new Client();
  try {
    await sftp.connect(connectInfo);
    return sftp;
  } catch (error) {
    const { message, stack } = describeError(error);
    logger.error(
      `Failed to connect to SFTP ${connectInfo.host}: ${message}`,
      stack,
    );
    throw error;
  }
};

export const listFiles = async (
  logger: Logger,
  sftp: Client,
  remotePath: string,
): Promise<Client.FileInfo[]> => {
  try {
    return await sftp.list(remotePath);
  } catch (error) {
    const { message, stack } = describeError(error);
    logger.error(`Failed to list files from remote: ${message}`, stack);
    throw error;
  }
};

export const downloadFromRemote = async (
  logger: Logger,
  sftp: Client,
  remotePath: string,
  file: Client.FileInfo,
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    const fileData: Buffer<ArrayBufferLike> = (await sftp.get(
      remotePath + '/' + file.name,
    )) as Buffer<ArrayBufferLike>;
    return fileData;
  } catch (error) {
    const { message, stack } = describeError(error);
    logger.error(
      `Failed to download file ${file.name} from remote: ${message}`,
      stack,
    );
    throw error;
  }
};

export const deleteFromRemote = async (
  logger: Logger,
  sftp: Client,
  remotePath: string,
  file: Client.FileInfo,
): Promise<void> => {
  try {
    await sftp.delete(remotePath + '/' + file.name, false);
  } catch (error) {
    const { message, stack } = describeError(error);
    logger.error(
      `Failed to delete file ${file.name} from remote: ${message}`,
      stack,
    );
    throw error;
  }
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
    logger.error('Cannot connect to ${process.env.CFS_SFTP_HOST} via SFTP.');
    logger.error(error);
    throw new InternalServerErrorException(
      'Cannot connect to ${process.env.CFS_SFTP_HOST} via SFTP.',
    );
  }
  try {
    const res = await sftp.put(fileData.buffer, remotePath + fileName);
    logger.log(`Successfully sent file ${fileName} via SFTP.`);
    return res;
  } catch (error) {
    logger.error(
      `Failed to send file to ${process.env.CFS_SFTP_HOST} via SFTP.`,
    );
    logger.error(error);
    throw new InternalServerErrorException(
      `Failed to send file to ${process.env.CFS_SFTP_HOST} via SFTP.`,
    );
  } finally {
    logger.log('closing connection');
    void sftp.end();
  }
};

export const uploadToGarms = async (fileName: string, logger: Logger) => {
  const sftp = new Client();
  const connectionInfo = getGarmSFTPConnectionInfo();

  try {
    await sftp.connect(connectionInfo);
    logger.log(`Successfully connected to ${process.env.GARMS_HOST} via SFTP.`);
  } catch (error) {
    logger.error(`Cannot connect to ${process.env.GARMS_HOST} via SFTP.`);
    logger.error(error);
    throw new InternalServerErrorException(
      `Cannot connect to ${process.env.GARMS_HOST} via SFTP.`,
    );
  }
  try {
    const res = await sftp.put(GARMS_LOCAL_FILE_PATH + fileName, fileName, {
      writeStreamOptions: { encoding: 'ascii' },
    });
    logger.log(`Successfully sent file ${fileName} via SFTP.`);
    return res;
  } catch (error) {
    logger.error('Failed to send file to ${process.env.GARMS_HOST} via SFTP.');
    logger.error(error);
    throw new InternalServerErrorException(
      'Failed to send file to ${process.env.GARMS_HOST} via SFTP.',
    );
  } finally {
    logger.log('closing connection');
    void sftp.end();
  }
};
