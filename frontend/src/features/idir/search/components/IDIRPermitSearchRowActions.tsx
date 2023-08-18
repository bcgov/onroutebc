import { useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import ResendDialog from "./ResendDialog";

const ACTIVE_OPTIONS = ["Amend", "View Receipt", "Resend", "Void"];
const EXPIRED_OPTIONS = ["View Receipt", "Resend"];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns string[]
 */
const getOptions = (isExpired: boolean): string[] => {
  return isExpired ? EXPIRED_OPTIONS : ACTIVE_OPTIONS;
};

/**
 * Component for row actions on IDIR Search Permit.
 */
export const IDIRPermitSearchRowActions = ({
  isExpired,
  permitNumber,
  email,
  fax,
}: {
  /**
   * Has the permit expired?
   */
  isExpired: boolean;
  /**
   * The permit number
   */
  permitNumber: string;
  /**
   * The email address (for use in resend dialog)
   */
  email?: string;
  /**
   * The fax number (for use in resend dialog)
   */
  fax?: string;
}) => {
  const [isResendOpen, setIsResendOpen] = useState<boolean>(false);

  /**
   * Function to handle user selection from the options.
   * @param selectedOption The selected option as a string.
   */
  const onSelectOption = (selectedOption: string) => {
    if (selectedOption === "Resend") {
      setIsResendOpen(() => true);
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={getOptions(isExpired)}
        key={`idir-search-row-${permitNumber}`}
      />
      <ResendDialog
        isOpen={isResendOpen}
        onClickCancel={() => setIsResendOpen(false)}
        onClickResend={() => setIsResendOpen(false)}
        email={email}
        fax={fax}
        permitNumber={permitNumber}
      />
    </>
  );
};
