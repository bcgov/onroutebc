import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAmendmentApplicationQuery, useDeleteApplicationsMutation } from "./hooks";
import { ERROR_ROUTES, PERMITS_ROUTES } from "../../../routes/constants";
import { hasPermitsActionFailed } from "../helpers/permitState";

export const useAttemptAmend = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<number>(0);
  const [permitId, setPermitId] = useState<string>("");
  const [attemptedAmend, setAttemptedAmend] = useState<boolean>(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState<boolean>(false);

  // Set the companyId and permitId in order to query any existing amendment applications
  // This step is necessary since the query will only be performed when these two values
  // are available.
  const choosePermitToAmend = (selectedCompanyId: number, selectedPermitId: string) => {
    setCompanyId(selectedCompanyId);
    setPermitId(selectedPermitId);
    setAttemptedAmend(true);
  };

  const {
    data: existingAmendmentApplication,
  } = useAmendmentApplicationQuery(companyId, permitId);

  const hasExistingApplication = Boolean(existingAmendmentApplication);
  useEffect(() => {
    if (hasExistingApplication && attemptedAmend) {
      setShowUnfinishedModal(true);
    }
  }, [hasExistingApplication, attemptedAmend]);

  const handleCloseModal = () => {
    setAttemptedAmend(false);
    setShowUnfinishedModal(false);
  };

  const { mutateAsync: deleteApplications } = useDeleteApplicationsMutation();
  const deleteAmendmentApplication = async (
    companyOfAmendment: number,
    amendmentApplicationId: string,
  ) => {
    return await deleteApplications({
      companyId: companyOfAmendment,
      applicationIds: [amendmentApplicationId],
    });
  };

  const existingAmendmentApplicationId = existingAmendmentApplication?.permitId;
  const handleStartNewAmendment = useCallback(async () => {
    if (existingAmendmentApplicationId) {
      const deleteExistingResult = await deleteAmendmentApplication(
        companyId,
        existingAmendmentApplicationId,
      );

      if (deleteExistingResult.status !== 200 || hasPermitsActionFailed(deleteExistingResult.data)) {
        return navigate(ERROR_ROUTES.UNEXPECTED);
      }

      // Delete was successful, go to amend form page with issued permit data
      navigate(PERMITS_ROUTES.AMEND(companyId, permitId));
    } else {
      // For some reason, existing amendment application doesn't exist (possibly deleted by another staff)
      // just go to amend form page with issued permit data
      navigate(PERMITS_ROUTES.AMEND(companyId, permitId));
    }
  }, [companyId, permitId, existingAmendmentApplicationId]);

  const handleContinueAmendment = useCallback(() => {
    navigate(PERMITS_ROUTES.AMEND(companyId, permitId));
  }, [companyId, permitId]);

  return {
    choosePermitToAmend,
    showUnfinishedModal,
    existingAmendmentApplication,
    handleCloseModal,
    handleStartNewAmendment,
    handleContinueAmendment,
  };
};
