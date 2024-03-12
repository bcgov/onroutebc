import { useContext, useEffect, useState } from "react";

import "./Suspend.scss";
import { SuspendModal } from "../components/suspend/SuspendModal";
import { Switch } from "@mui/material";
import { useSuspendCompanyMutation, useSuspensionHistoryQuery } from "../hooks/suspend";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { SuspensionHistory } from "../components/suspend/SuspensionHistory";
import { SUSPEND_ACTIVITY_TYPES } from "../types/suspend";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { canUpdateSuspend } from "../helpers/permissions";

export const Suspend = ({
  companyId,
}: {
  companyId: number;
}) => {
  const {
    data: suspensionHistory,
    isError: fetchHistoryError,
  } = useSuspensionHistoryQuery(companyId);

  // Check if user can update suspend
  const { userRoles } = useContext(OnRouteBCContext);
  const canSuspendCompany = canUpdateSuspend(userRoles);

  const suspendCompanyMutation = useSuspendCompanyMutation();

  const suspensionHistoryList = fetchHistoryError ?
    [] : getDefaultRequiredVal([], suspensionHistory);
  
  const [showSuspendModal, setShowSuspendModal] = useState<boolean>(false);
  const [companySuspended, setCompanySuspended] = useState<boolean>(false);

  useEffect(() => {
    // Get current suspension status for company from the most recent entry in suspension history
    // If suspension history is empty, it's assumed that the company has not yet been suspended
    const isCurrentlySuspended = suspensionHistoryList.length > 0
      ? suspensionHistoryList[0].suspendActivityType === SUSPEND_ACTIVITY_TYPES.SUSPEND_COMPANY
      : false;

    setCompanySuspended(isCurrentlySuspended);
  }, [suspensionHistoryList]);

  const isActionSuccessful = (status: number) => {
    return status === 200 || status === 201;
  };

  const handleSuspendCompany = async (reason: string) => {
    const suspendResult = await suspendCompanyMutation.mutateAsync({
      companyId,
      data: {
        suspendActivityType: SUSPEND_ACTIVITY_TYPES.SUSPEND_COMPANY,
        comment: reason,
      },
    });

    if (isActionSuccessful(suspendResult.status)) {
      setCompanySuspended(true);
      setShowSuspendModal(false);
    }
  };

  const handleUnsuspendCompany = async () => {
    const unsuspendResult = await suspendCompanyMutation.mutateAsync({
      companyId,
      data: {
        suspendActivityType: SUSPEND_ACTIVITY_TYPES.UNSUSPEND_COMPANY,
      },
    });

    if (isActionSuccessful(unsuspendResult.status)) {
      setCompanySuspended(false);
      setShowSuspendModal(false);
    }
  };

  const handleSuspendToggle = async (toSuspend: boolean) => {
    if (toSuspend) {
      setShowSuspendModal(true);
    } else {
      await handleUnsuspendCompany();
    }
  };

  return (
    <div className="suspend-page">
      <div className="suspend-page__suspend-company">
        <div className="suspend-page__title suspend-page__title--company">
          Suspend Company
        </div>

        {canSuspendCompany ? (
          <Switch
            className="suspend-company-switch"
            checked={companySuspended}
            onChange={async (_, checked) => await handleSuspendToggle(checked)}
          />
        ): null}
      </div>

      {suspensionHistoryList.length > 0 ? (
        <div className="suspend-page__suspension-history">
          <div className="suspend-page__title suspend-page__title--history">
            Suspension History
          </div>

          <SuspensionHistory suspensionHistory={suspensionHistoryList} />
        </div>
      ) : null}

      {showSuspendModal ? (
        <SuspendModal
          showModal={showSuspendModal}
          onCancel={() => setShowSuspendModal(false)}
          onConfirm={handleSuspendCompany}
        />
      ) : null}
    </div>
  );
};
