import { useContext, useEffect, useState } from "react";
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
import { PERMIT_ACTION_ORIGINS, PermitActionOrigin } from "../../types/PermitActionOrigin";
import { PERMIT_ACTION_TYPES } from "../../types/PermitActionType";
import { getPermitActionOptions } from "../../helpers/getPermitActionOptions";
import { useSetCompanyHandler } from "../../../idir/search/helpers/useSetCompanyHandler";
import { useCompanyInfoDetailsQuery } from "../../../manageProfile/apiManager/hooks";

export const PermitRowOptions = ({
  permitId,
  isPermitInactive,
  permitNumber,
  companyId,
  permitActionOrigin,
  permissions,
}: {
  permitId: string;
  // Is the permit inactive (voided/superseded/revoked) or expired?
  isPermitInactive: boolean;
  permitNumber: string;
  companyId: number;
  // The application location from where the permit action (amend/void/revoke/copy) originated
  permitActionOrigin: PermitActionOrigin;
  // Object containing the relevant permission matrix checks for each action
  permissions: {
    canResendPermit: boolean;
    canViewPermitReceipt: boolean;
    canViewExpiredPermitReceipt: boolean;
    canAmendPermit: boolean;
    canVoidPermit: boolean;
    canCopyPermit: boolean;
  };
}) => {
  const [openResendDialog, setOpenResendDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const resendPermitMutation = useResendPermit();
  const { setSnackBar } = useContext(SnackBarContext);
  const { handleSelectCompany } = useSetCompanyHandler();

  // This is used to trigger a query fetch of the company info when
  // copying a permit in staff global search
  const [companyIdForCopy, setCompanyIdForCopy] = useState<number>(0);
  const { data: selectedCompanyInfo } = useCompanyInfoDetailsQuery(companyIdForCopy);
  useEffect(() => {
    if (selectedCompanyInfo && companyId && permitId) {
      handleSelectCompany(
        selectedCompanyInfo,
        routes.PERMITS_ROUTES.COPY(
          companyId,
          permitId,
          // After acting as company, leaving the copy permit should go back to AIP tab
          PERMIT_ACTION_ORIGINS.AIP,
        )
      );
    }
  }, [selectedCompanyInfo, companyId, permitId]);

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
    } else if (selectedOption === PERMIT_ACTION_TYPES.COPY) {
      // If copying permit from staff global search, we need to act as company first.
      // ie. set companyId which will trigger the company info query fetch, and in turn
      // set the company info in the context
      if (permitActionOrigin === PERMIT_ACTION_ORIGINS.GLOBAL_SEARCH) {
        setCompanyIdForCopy(companyId);
      } else {
        // The copying action is initiated after already acting as company
        // Simply redirect to the copy permit form page
        const copyPermitRoute = routes.PERMITS_ROUTES.COPY(
          companyId,
          permitId,
          permitActionOrigin,
        );
        
        navigate(copyPermitRoute);
      }
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
    canViewExpiredPermitReceipt,
    canAmendPermit,
    canVoidPermit,
    canCopyPermit,
  } = permissions;

  const permitActions = [
    {
      action: PERMIT_ACTION_TYPES.COPY,
      isAuthorized: () => canCopyPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.RESEND,
      isAuthorized: () => canResendPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.VIEW_RECEIPT,
      isAuthorized: (isExpired: boolean) =>
        (!isExpired && canViewPermitReceipt) ||
        (isExpired && canViewExpiredPermitReceipt),
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
