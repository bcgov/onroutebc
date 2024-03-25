import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "./PermitResendDialog";
import { viewReceiptPdf } from "../../../permits/helpers/permitPDFHelper";
import * as routes from "../../../../routes/constants";
import { USER_AUTH_GROUP } from "../../../../common/authentication/types";
import { Nullable } from "../../../../common/types/common";
import { useResendPermit } from "../../../permits/hooks/hooks";
import { SnackBarContext } from "../../../../App";

const PERMIT_ACTION_TYPES = {
  RESEND: "resend",
  VIEW_RECEIPT: "viewReceipt",
  AMEND: "amend",
  VOID_REVOKE: "voidRevoke",
} as const;

type PermitActionType =
  (typeof PERMIT_ACTION_TYPES)[keyof typeof PERMIT_ACTION_TYPES];

const permitActionLabel = (actionType: PermitActionType) => {
  switch (actionType) {
    case PERMIT_ACTION_TYPES.RESEND:
      return "Resend";
    case PERMIT_ACTION_TYPES.VIEW_RECEIPT:
      return "View Receipt";
    case PERMIT_ACTION_TYPES.AMEND:
      return "Amend";
    case PERMIT_ACTION_TYPES.VOID_REVOKE:
      return "Void/Revoke";
    default:
      return "";
  }
};

interface PermitAction {
  action: PermitActionType;
  isAuthorized: (isExpired: boolean, userAuthGroup?: string) => boolean;
}

const PERMIT_ACTIONS: PermitAction[] = [
  {
    action: PERMIT_ACTION_TYPES.RESEND,
    isAuthorized: (_: boolean, userAuthGroup?: string) =>
      userAuthGroup === USER_AUTH_GROUP.PPC_CLERK ||
      userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  },
  {
    action: PERMIT_ACTION_TYPES.VIEW_RECEIPT,
    isAuthorized: (_: boolean, userAuthGroup?: string) =>
      userAuthGroup === USER_AUTH_GROUP.PPC_CLERK ||
      userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR ||
      userAuthGroup === USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
  },
  {
    action: PERMIT_ACTION_TYPES.AMEND,
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) =>
      !isExpired &&
      (userAuthGroup === USER_AUTH_GROUP.PPC_CLERK ||
        userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR),
  },
  {
    action: PERMIT_ACTION_TYPES.VOID_REVOKE,
    isAuthorized: (isExpired: boolean, userAuthGroup?: string) =>
      !isExpired && userAuthGroup === USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  },
];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns Action options that can be performed for the permit.
 */
const getOptions = (isExpired: boolean, userAuthGroup?: string) => {
  return PERMIT_ACTIONS.filter((action) =>
    action.isAuthorized(isExpired, userAuthGroup),
  ).map(({ action }) => ({
    label: permitActionLabel(action),
    value: action,
  }));
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
  permitId: string;
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
  const [openResendDialog, setOpenResendDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const resendPermitMutation = useResendPermit();
  const { setSnackBar } = useContext(SnackBarContext);

  /**
   * Function to handle user selection from the options.
   * @param selectedOption The selected option as a string.
   */
  const onSelectOption = (selectedOption: string) => {
    if (selectedOption === PERMIT_ACTION_TYPES.RESEND) {
      setOpenResendDialog(() => true);
    } else if (selectedOption === PERMIT_ACTION_TYPES.VIEW_RECEIPT) {
      viewReceiptPdf(permitId);
    } else if (selectedOption === PERMIT_ACTION_TYPES.VOID_REVOKE) {
      navigate(`${routes.PERMITS_ROUTES.VOID(permitId)}`);
    } else if (selectedOption === PERMIT_ACTION_TYPES.AMEND) {
      navigate(`${routes.PERMITS_ROUTES.AMEND(permitId)}`);
    }
  };

  const handleResend = async (
    permitId: string,
    email: string,
    fax?: Nullable<string>,
  ) => {
    const response = await resendPermitMutation.mutateAsync({
      permitId,
      email,
      fax,
    });

    setOpenResendDialog(false);
    if (response.status === 201) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Successfully sent",
        alertType: "success",
      });
    } else {
      navigate(routes.ERROR_ROUTES.UNEXPECTED);
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
        shouldOpen={openResendDialog}
        onCancel={() => setOpenResendDialog(false)}
        onResend={handleResend}
        permitId={permitId}
        email={email}
        fax={fax}
        permitNumber={permitNumber}
      />
    </>
  );
};
