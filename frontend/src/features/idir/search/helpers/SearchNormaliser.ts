export const normalizeClientNumber = (input: string): string => {
  // Remove non-alphanumeric characters and convert to uppercase
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, "");

  // Add hyphens after 2nd and 8th character
  const part1 = cleaned.slice(0, 2);
  const part2 = cleaned.slice(2, 8);
  const part3 = cleaned.slice(8, 11);

  // Combine with hyphens as needed. User can enter 2 to 11 characters.
  return (
    part1 +
    (cleaned.length > 2 ? `-${part2}` : "") +
    (cleaned.length > 8 ? `-${part3}` : "")
  );
};

export const normalizePlateNumber = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[-\s]/g, "") // remove spaces and dashes
    .trim();
};

export const normalizePermitNumber = (input: string): string => {
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, ""); // remove all non-alphanumerics

  const part1 = cleaned.slice(0, 2);
  const part2 = cleaned.slice(2, 10);
  const part3 = cleaned.slice(10, 13);

  return (
    part1 +
    (cleaned.length > 2 ? `-${part2}` : "") +
    (cleaned.length > 10 ? `-${part3}` : "")
  );
};
