import { useState } from "react";
import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "./PermitResendDialog";
import { viewReceiptPdf } from "../../../permits/helpers/permitPDFHelper";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../../routes/constants";
import { USER_AUTH_GROUP } from "../../../../common/authentication/types";

const APPLICATION_ACTION_TYPES = {
  RESEND: "resend",
  VIEW_RECEIPT: "viewReceipt",
  AMEND: "amend",
  VOID_REVOKE: "voidRevoke",
} as const;

type ApplicationActionType =
  (typeof APPLICATION_ACTION_TYPES)[keyof typeof APPLICATION_ACTION_TYPES];

const applicationActionLabel = (actionType: ApplicationActionType) => {
  switch (actionType) {
    case APPLICATION_ACTION_TYPES.RESEND:
      return "Resend";
    case APPLICATION_ACTION_TYPES.VIEW_RECEIPT:
      return "View Receipt";
    case APPLICATION_ACTION_TYPES.AMEND:
      return "Amend";
    case APPLICATION_ACTION_TYPES.VOID_REVOKE:
      return "Void/Revoke";
    default:
      return "";
  }
};

interface ApplicationAction {
  action: ApplicationActionType;
  isAuthorized: (isExpired: boolean, userAuthGroup?: string) => boolean;
}

const APPLICATION_ACTIONS: ApplicationAction[] = [
  /*
  {
    action: PERMIT_ACTION_TYPES.RESEND,
    isAuthorized: (_: boolean, userAuthGroup?: string) =>
      userAuthGroup === USER_AUTH_GROUP.PPCCLERK ||
      userAuthGroup === USER_AUTH_GROUP.SYSADMIN,
  },
  */
  {
    action: APPLICATION_ACTION_TYPES.VIEW_RECEIPT,
    isAuthorized: (_: boolean, userAuthGroup?: string) =>
      userAuthGroup === USER_AUTH_GROUP.PPC_CLERK ||
      userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR ||
      userAuthGroup === USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
  },
  {
    action: APPLICATION_ACTION_TYPES.AMEND,
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) =>
      !isExpired &&
      (userAuthGroup === USER_AUTH_GROUP.PPC_CLERK ||
        userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR),
  },
  {
    action: APPLICATION_ACTION_TYPES.VOID_REVOKE,
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) =>
      !isExpired && userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  },
];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns string[]
 */
const getOptions = (isExpired: boolean, userAuthGroup?: string) => {
  return APPLICATION_ACTIONS.filter((action) =>
    action.isAuthorized(isExpired, userAuthGroup),
  ).map(({ action }) => ({
    label: applicationActionLabel(action),
    value: action,
  }));
};

/**
 * Component for row actions on IDIR Search Permit.
 */
export const IDIRApplicationSearchRowActions = ({
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
    const permitIdStr = `${permitId}`;

    if (selectedOption === APPLICATION_ACTION_TYPES.RESEND) {
      // For implementation
      setIsResendOpen(() => true);
    } else if (selectedOption === APPLICATION_ACTION_TYPES.VIEW_RECEIPT) {
      viewReceiptPdf(permitId.toString());
    } else if (selectedOption === APPLICATION_ACTION_TYPES.VOID_REVOKE) {
      navigate(`${routes.PERMITS_ROUTES.VOID(permitIdStr)}`);
    } else if (selectedOption === APPLICATION_ACTION_TYPES.AMEND) {
      navigate(`${routes.PERMITS_ROUTES.AMEND(permitIdStr)}`);
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
