import * as CryptoJS from 'crypto-js';

export const validateHash = (
  queryString: string,
  hashvalue: string,
): boolean => {
  const payBCHash: string = CryptoJS.MD5(
    `${queryString}${process.env.PAYBC_API_KEY}`,
  ).toString();
  return hashvalue === payBCHash;
};