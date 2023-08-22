import { useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "./PermitResendDialog";
import { viewReceiptPdf } from "../../../permits/helpers/permitPDFHelper";

const ACTIVE_OPTIONS = ["Amend", "View Receipt", "Resend", "Void"];
const EXPIRED_OPTIONS = ["View Receipt", "Resend"];
const MINIMAL_OPTIONS = ["View Receipt"];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns string[]
 */
const getOptions = (isExpired: boolean, userAuthGroup?: string): string[] => {
  if (userAuthGroup === "EOFFICER") return MINIMAL_OPTIONS;
  return isExpired ? EXPIRED_OPTIONS : ACTIVE_OPTIONS;
};

/**
 * Component for row actions on IDIR Search Permit.
 */
export const IDIRPermitSearchRowActions = ({
  permitId,
  isExpired,
  permitNumber,
  email,
  fax,
  userAuthGroup,
}: {
  /**
   * The permit id.
   */
  permitId: number;
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
  /**
   * The auth group for the current user (eg. PPC_CLERK or EOFFICER)
   */
  userAuthGroup?: string;
}) => {
  const [isResendOpen, setIsResendOpen] = useState<boolean>(false);

  /**
   * Function to handle user selection from the options.
   * @param selectedOption The selected option as a string.
   */
  const onSelectOption = (selectedOption: string) => {
    if (selectedOption === "Resend") {
      // For implementation
      setIsResendOpen(() => true);
    } else if (selectedOption === "View Receipt") {
      viewReceiptPdf(permitId.toString());
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={getOptions(isExpired, userAuthGroup)}
        key={`idir-search-row-${permitNumber}`}
      />
      <PermitResendDialog
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
