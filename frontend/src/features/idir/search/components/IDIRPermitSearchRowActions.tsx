import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "./PermitResendDialog";
import { viewReceiptPdf } from "../../../permits/helpers/permitPDFHelper";
import * as routes from "../../../../routes/constants";
import { USER_ROLE } from "../../../../common/authentication/types";
import { useResendPermit } from "../../../permits/hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { EmailNotificationType } from "../../../permits/types/EmailNotificationType";
import { useAttemptAmend } from "../../../permits/hooks/useAttemptAmend";
import { UnfinishedAmendModal } from "../../../permits/pages/Amend/components/modal/UnfinishedAmendModal";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { PermitActionOrigin } from "../types/types";

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
  isAuthorized: (isExpired: boolean, userRole?: string) => boolean;
}

const PERMIT_ACTIONS: PermitAction[] = [
  {
    action: PERMIT_ACTION_TYPES.RESEND,
    isAuthorized: (_: boolean, userRole?: string) =>
      userRole === USER_ROLE.PPC_CLERK ||
      userRole === USER_ROLE.SYSTEM_ADMINISTRATOR ||
      userRole === USER_ROLE.HQ_ADMINISTRATOR ||
      userRole === USER_ROLE.FINANCE ||
      userRole === USER_ROLE.ENFORCEMENT_OFFICER,
  },
  {
    action: PERMIT_ACTION_TYPES.VIEW_RECEIPT,
    isAuthorized: (_: boolean, userRole?: string) =>
      userRole === USER_ROLE.PPC_CLERK ||
      userRole === USER_ROLE.SYSTEM_ADMINISTRATOR ||
      userRole === USER_ROLE.ENFORCEMENT_OFFICER,
  },
  {
    action: PERMIT_ACTION_TYPES.AMEND,
    isAuthorized: (isExpired: boolean, userRole?: string) =>
      !isExpired &&
      (userRole === USER_ROLE.PPC_CLERK ||
        userRole === USER_ROLE.SYSTEM_ADMINISTRATOR),
  },
  {
    action: PERMIT_ACTION_TYPES.VOID_REVOKE,
    isAuthorized: (isExpired: boolean, userRole?: string) =>
      !isExpired && userRole === USER_ROLE.SYSTEM_ADMINISTRATOR,
  },
];

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns Action options that can be performed for the permit.
 */
const getOptions = (isExpired: boolean, userRole?: string) => {
  return PERMIT_ACTIONS.filter((action) =>
    action.isAuthorized(isExpired, userRole),
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
  userRole,
  companyId,
  permitActionOrigin,
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
   * The role for the current user (eg. PPCCLERK or EOFFICER)
   */
  userRole?: string;
  companyId: number;
  /**
   * The application location from where the permit action (amend / void / revoke) originated
   */
  permitActionOrigin: PermitActionOrigin;
}) => {
  const [openResendDialog, setOpenResendDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const resendPermitMutation = useResendPermit();
  const { setSnackBar } = useContext(SnackBarContext);

  const {
    choosePermitToAmend,
    showUnfinishedModal,
    existingAmendmentApplication,
    handleCloseModal,
    handleStartNewAmendment,
    handleContinueAmendment,
  } = useAttemptAmend(permitActionOrigin);

  const existingAmendmentCreatedBy = getDefaultRequiredVal(
    "",
    existingAmendmentApplication?.applicant,
  );

  /**
   * Function to handle user selection from the options.
   * @param selectedOption The selected option as a string.
   */
  const onSelectOption = (selectedOption: string) => {
    if (selectedOption === PERMIT_ACTION_TYPES.RESEND) {
      setOpenResendDialog(() => true);
    } else if (selectedOption === PERMIT_ACTION_TYPES.VIEW_RECEIPT) {
      viewReceiptPdf(companyId, permitId, () =>
        navigate(routes.ERROR_ROUTES.DOCUMENT_UNAVAILABLE),
      );
    } else if (selectedOption === PERMIT_ACTION_TYPES.VOID_REVOKE) {
      navigate(`${routes.PERMITS_ROUTES.VOID(companyId, permitId)}`, {
        state: { permitActionOrigin },
      });
    } else if (selectedOption === PERMIT_ACTION_TYPES.AMEND) {
      // Sets the companyId and permitId of the permit to be amended,
      // which will in turn look for any existing associated amendment applications,
      // which is used to show info in the modal (or not show the modal at all)
      choosePermitToAmend(companyId, permitId);
    }
  };

  const handleResend = async (
    permitId: string,
    email: string,
    notificationTypes: EmailNotificationType[],
  ) => {
    const response = await resendPermitMutation.mutateAsync({
      permitId,
      email,
      notificationTypes,
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
      navigate(routes.ERROR_ROUTES.UNEXPECTED, {
        state: { correlationId: response.headers["x-correlation-id"] },
      });
    }
  };

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={getOptions(isPermitInactive, userRole)}
        key={`idir-search-row-${permitNumber}`}
      />

      <PermitResendDialog
        shouldOpen={openResendDialog}
        onCancel={() => setOpenResendDialog(false)}
        onResend={handleResend}
        companyId={companyId}
        permitId={permitId}
        permitNumber={permitNumber}
      />

      <UnfinishedAmendModal
        shouldOpen={showUnfinishedModal}
        issuedPermitNumber={permitNumber}
        unfinishedAmendmentCreatedBy={existingAmendmentCreatedBy}
        onCancel={handleCloseModal}
        onStartNewAmendment={handleStartNewAmendment}
        onContinueAmendment={handleContinueAmendment}
      />
    </>
  );
};
