export const removeNonNumericValues = (input: string) =>
  input.replace(/[^0-9]/g, "");
