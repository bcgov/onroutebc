import * as crypto from 'crypto';

export const stringToSHA256 = (stringValue: string): string => {
  return crypto
    .createHash('sha256')
    .update(stringValue?.replace(/-/g, ''))
    .digest('hex');
};

export const stringToMD5 = (stringValue: string): string => {
  return crypto
    .createHash('md5')
    .update(`${stringValue}${process.env.PAYBC_API_KEY}`)
    .digest('hex');
};
