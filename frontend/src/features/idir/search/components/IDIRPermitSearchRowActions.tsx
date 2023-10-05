import { useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "./PermitResendDialog";
import { viewReceiptPdf } from "../../../permits/helpers/permitPDFHelper";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../../routes/constants";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";

interface PermitAction {
  actionName: string;
  isAuthorized: (isExpired: boolean, userAuthGroup?: string) => boolean;
}

const PERMIT_ACTIONS: PermitAction[]  = [
  {
    actionName: "Amend",
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) => 
      !isExpired && (
        userAuthGroup === USER_AUTH_GROUP.PPCCLERK || userAuthGroup === USER_AUTH_GROUP.SYSADMIN
      ),
  },
  {
    actionName: "View Receipt",
    isAuthorized: (_: boolean, userAuthGroup?: string) => 
      userAuthGroup === USER_AUTH_GROUP.PPCCLERK 
      || userAuthGroup === USER_AUTH_GROUP.SYSADMIN 
      || userAuthGroup === USER_AUTH_GROUP.EOFFICER,
  },
  {
    actionName: "Resend",
    isAuthorized: (_: boolean, userAuthGroup?: string) =>
      userAuthGroup === USER_AUTH_GROUP.PPCCLERK || userAuthGroup === USER_AUTH_GROUP.SYSADMIN,
  },
  {
    actionName: "Void",
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) =>
      !isExpired && userAuthGroup === USER_AUTH_GROUP.SYSADMIN,
  },
];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns string[]
 */
const getOptions = (isExpired: boolean, userAuthGroup?: string): string[] => {
  return PERMIT_ACTIONS
    .filter(action => action.isAuthorized(isExpired, userAuthGroup))
    .map(action => action.actionName);
};

/**
 * Component for row actions on IDIR Search Permit.
 */
export const IDIRPermitSearchRowActions = ({
  permitId,
  isPermitInactive,
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
   * Is the permit inactive (voided/superseded/revoked) or expired?
   */
  isPermitInactive: boolean;
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
   * The auth group for the current user (eg. PPCCLERK or EOFFICER)
   */
  userAuthGroup?: string;
}) => {
  const [isResendOpen, setIsResendOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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
    } else if (selectedOption === "Void") {
      navigate(`/${routes.PERMITS}/${permitId}/${routes.PERMIT_VOID}`);
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={getOptions(isPermitInactive, userAuthGroup)}
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
