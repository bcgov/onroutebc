import * as crypto from 'crypto';

export const convertToHash = (
  stringValue: string,
  hashAlgorithm: string,
): string => {
  return crypto.createHash(hashAlgorithm).update(stringValue).digest('hex');
};
