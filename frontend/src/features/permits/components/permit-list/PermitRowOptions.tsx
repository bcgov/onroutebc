import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnRouteBCTableRowActions } from "../../../../common/components/table/OnRouteBCTableRowActions";
import PermitResendDialog from "../../../idir/search/components/PermitResendDialog";
import { viewReceiptPdf } from "../../helpers/permitPDFHelper";
import * as routes from "../../../../routes/constants";
import { useResendPermit } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { EmailNotificationType } from "../../types/EmailNotificationType";
import { useAttemptAmend } from "../../hooks/useAttemptAmend";
import { UnfinishedAmendModal } from "../../pages/Amend/components/modal/UnfinishedAmendModal";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { PermitActionOrigin } from "../../../idir/search/types/types";
import { PERMIT_ACTION_TYPES } from "../../types/PermitActionType";
import { getPermitActionOptions } from "../../helpers/getPermitActionOptions";

/**
 * Component for row actions on IDIR Search Permit.
 */
export const PermitRowOptions = ({
  permitId,
  isPermitInactive,
  permitNumber,
  companyId,
  permitActionOrigin,
  permissions,
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
   * The company id
   */
  companyId: number;
  /**
   * The application location from where the permit action (amend / void / revoke) originated
   */
  permitActionOrigin: PermitActionOrigin;
  /**
   * An object containing the relevant permission matrix checks for each action
   */
  permissions: {
    canResendPermit: boolean;
    canViewPermitReceipt: boolean;
    canAmendPermit: boolean;
    canVoidPermit: boolean;
  };
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
      navigate(`${routes.PERMITS_ROUTES.VOID(companyId, permitId)}`);
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

  const {
    canResendPermit,
    canViewPermitReceipt,
    canAmendPermit,
    canVoidPermit,
  } = permissions;

  const permitActions = [
    {
      action: PERMIT_ACTION_TYPES.RESEND,
      isAuthorized: () => canResendPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.VIEW_RECEIPT,
      isAuthorized: () => canViewPermitReceipt,
    },
    {
      action: PERMIT_ACTION_TYPES.AMEND,
      isAuthorized: (isExpired: boolean) => !isExpired && canAmendPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.VOID_REVOKE,
      isAuthorized: (isExpired: boolean) => !isExpired && canVoidPermit,
    },
  ];

  return (
    <>
      <OnRouteBCTableRowActions
        onSelectOption={onSelectOption}
        options={getPermitActionOptions(permitActions, isPermitInactive)}
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
