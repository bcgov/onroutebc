import { Nullable } from "../../types/common";
import { invalidExtension, invalidExtensionLength } from "../validationMessages";

/**
 * Validate optional phone extension.
 * @param ext Provided phone extension, if any
 * @returns true if phone extension is valid, error message otherwise
 */
export const validatePhoneExtension = (ext?: Nullable<string>) => {
  if (!ext) return true; // empty or not-provided phone extension is acceptable

  // Must have exactly 1-5 digits
  if (!/^[0-9]{1,5}$/.test(ext)) return invalidExtension();
  return ext.length <= 5 || invalidExtensionLength(5);
};
