export const  sftpConfig = {
    host: process.env.CFS_SFTP_HOST,
    port: Number(process.env.CFS_SFTP_PORT),
    username: process.env.CFS_SFTP_USERNAME,
    privateKey: process.env.CFS_PRIVATE_KEY,
    passphrase: process.env.CFS_PRIVATE_KEY_PASSPHRASE,
  };