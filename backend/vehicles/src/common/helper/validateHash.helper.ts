
export const validateHash = (
  queryString: string,
  hashvalue: string,
): boolean => {
  const payBCHash: string = CryptoJS.MD5(
    `${queryString}${process.env.PAYBC_API_KEY}`,
  ).toString();
  if(hashvalue === payBCHash)
  return true;
else 
return false;
};