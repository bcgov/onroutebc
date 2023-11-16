import validationMessages from "../constants/validation_messages.json";

const replacePlaceholders = (
  messageTemplate: string,
  placeholders: string[],
  ...args: (string | number | boolean)[]
) => {
  let errMsg = messageTemplate;
  placeholders.forEach((placeholderText, index) => {
    errMsg = errMsg.replaceAll(placeholderText, `${args[index]}`);
  });
  return errMsg;
};

export const requiredMessage = () => validationMessages.required.defaultMessage;
export const invalidNumber = () => validationMessages.NaN.defaultMessage;
export const invalidCountryCode = () =>
  validationMessages.country.defaultMessage;
export const invalidProvinceCode = () =>
  validationMessages.province.defaultMessage;
export const invalidDate = () => validationMessages.date.defaultMessage;
export const invalidPastStartDate = () =>
  validationMessages.date.start.past.defaultMessage;

export const invalidMaxStartDate = (max: number) => {
  const { messageTemplate, placeholders } = validationMessages.date.start.max;
  return replacePlaceholders(messageTemplate, placeholders, max);
};

export const invalidEmail = () => validationMessages.email.defaultMessage;

export const invalidPhoneLength = (min: number, max: number) => {
  const { messageTemplate, placeholders } = validationMessages.phone.length;
  return replacePlaceholders(messageTemplate, placeholders, min, max);
};

export const invalidExtensionLength = (max: number) => {
  const { messageTemplate, placeholders } = validationMessages.extension.length;
  return replacePlaceholders(messageTemplate, placeholders, max);
};

export const invalidAddressLength = (min: number, max: number) => {
  const { messageTemplate, placeholders } = validationMessages.address.length;
  return replacePlaceholders(messageTemplate, placeholders, min, max);
};

export const invalidCityLength = (min: number, max: number) => {
  const { messageTemplate, placeholders } = validationMessages.city.length;
  return replacePlaceholders(messageTemplate, placeholders, min, max);
};

export const invalidPostalCode = () =>
  validationMessages.postalCode.defaultMessage;

export const invalidFirstNameLength = (min: number, max: number) => {
  const { messageTemplate, placeholders } = validationMessages.firstName.length;
  return replacePlaceholders(messageTemplate, placeholders, min, max);
};

export const invalidLastNameLength = (min: number, max: number) => {
  const { messageTemplate, placeholders } = validationMessages.lastName.length;
  return replacePlaceholders(messageTemplate, placeholders, min, max);
};

export const invalidYearMin = (min: number | string) => {
  const { messageTemplate, placeholders } = validationMessages.year.min;
  return replacePlaceholders(messageTemplate, placeholders, min);
};

export const invalidVINLength = (len: number) => {
  const { messageTemplate, placeholders } = validationMessages.vin.length.equal;
  return replacePlaceholders(messageTemplate, placeholders, len);
};

export const invalidPlateLength = (max: number) => {
  const { messageTemplate, placeholders } = validationMessages.plate.length.max;
  return replacePlaceholders(messageTemplate, placeholders, max);
};
