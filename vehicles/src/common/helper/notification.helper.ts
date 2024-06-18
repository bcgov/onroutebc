/**
 * Generates a fax email address by formatting the provided fax number.
 *
 * @param {string} fax - The fax number to format.
 * @returns {string} The formatted fax email address, or undefined if the fax number is invalid.
 */
export const generateFaxEmail = (fax: string): string => {
  //Removes plus(+),paranthesis and hyphens
  const formattedFaxNumber = fax?.replace(/[+\D-]/g, '');

  return formattedFaxNumber
    ? process.env.BCGOV_FAX_EMAIL?.replace('<faxnumber>', formattedFaxNumber)
    : undefined;
};

/**
 * Validates a list of email and fax addresses, removing duplicates and empty values.
 *
 * @param {string[]} emailList - The list of email and fax addresses to validate.
 * @returns {string[]} The validated list of email and fax addresses, without duplicates or empty values.
 */
export const validateEmailandFaxList = (emailList: string[]): string[] => {
  return Array.from(new Set(emailList?.filter(Boolean)));
};
