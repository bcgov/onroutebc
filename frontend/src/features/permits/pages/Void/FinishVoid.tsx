import { useContext, useEffect } from "react";

import { VoidPermitContext } from "./context/VoidPermitContext";
import { RefundFormData } from "../Refund/types/RefundFormData";
import { Permit } from "../../types/permit";
import { usePermitHistoryQuery } from "../../hooks/hooks";
import { calculateAmountForVoid } from "../../helpers/feeSummary";
import { PERMIT_REFUND_ACTIONS, RefundPage } from "../Refund/RefundPage";
import { mapToVoidRequestData } from "./helpers/mapper";
import { useVoidPermit } from "./hooks/useVoidPermit";
import { isValidTransaction } from "../../helpers/payment";
import { Nullable } from "../../../../common/types/common";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

export const FinishVoid = ({
  permit,
  onSuccess,
  onFail,
}: {
  permit: Nullable<Permit>;
  onSuccess: () => void;
  onFail: () => void;
}) => {
  const { voidPermitData } = useContext(VoidPermitContext);

  const { email, additionalEmail, fax, reason } = voidPermitData;

  const { query: permitHistoryQuery, permitHistory } = usePermitHistoryQuery(
    permit?.originalPermitId,
  );

  const transactionHistory = permitHistoryQuery.isInitialLoading
    ? []
    : permitHistory.filter((history) =>
        isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
      );

  const amountToRefund = !permit
    ? 0
    : -1 * calculateAmountForVoid(permit, transactionHistory);

  const { mutation: voidPermitMutation, voidResults } = useVoidPermit();

  useEffect(() => {
    const voidFailed = hasPermitsActionFailed(voidResults);
    if (voidFailed) {
      onFail();
    } else if (getDefaultRequiredVal(0, voidResults?.success?.length) > 0) {
      // Void action was triggered, and has results (was successful)
      onSuccess();
    }
  }, [voidResults]);

  const handleFinish = (refundData: RefundFormData) => {
    const requestData = mapToVoidRequestData(
      voidPermitData,
      refundData,
      -1 * amountToRefund,
    );
    voidPermitMutation.mutate({
      permitId: voidPermitData.permitId,
      voidData: requestData,
    });
  };

  return (
    <RefundPage
      permitHistory={transactionHistory}
      amountToRefund={amountToRefund}
      email={email}
      additionalEmail={additionalEmail}
      fax={fax}
      reason={reason}
      permitNumber={permit?.permitNumber}
      permitType={permit?.permitType}
      permitAction={PERMIT_REFUND_ACTIONS.VOID}
      onFinish={handleFinish}
    />
  );
};
