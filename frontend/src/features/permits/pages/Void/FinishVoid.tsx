import { useContext, useEffect } from "react";

import { VoidPermitContext } from "./context/VoidPermitContext";
import { RefundFormData } from "../Refund/types/RefundFormData";
import { Permit } from "../../types/permit";
import { usePermitHistoryQuery } from "../../hooks/hooks";
import { calculateNetAmount } from "../../helpers/feeSummary";
import { RefundPage } from "../Refund/RefundPage";
import { mapToVoidRequestData } from "./helpers/mapper";
import { useVoidPermit } from "./hooks/useVoidPermit";

export const FinishVoid = ({
  permit,
  onSuccess,
}: {
  permit: Permit | null;
  onSuccess: () => void;
}) => {
  const { voidPermitData } = useContext(VoidPermitContext);

  const {
    email,
    fax,
    reason,
  } = voidPermitData;

  const { 
    query: permitHistoryQuery, 
    permitHistory, 
  } = usePermitHistoryQuery(permit?.originalPermitId);

  const transactionHistory = permitHistoryQuery.isInitialLoading
    ? [] : permitHistory;

  const amountToRefund = -1 * calculateNetAmount(transactionHistory);

  const { 
    mutation: voidPermitMutation,
    voidResults,
  } = useVoidPermit();

  useEffect(() => {
    if (voidResults && voidResults.success.length > 0) {
      // Navigate back to search page
      onSuccess();
    }
  }, [voidResults]);

  const handleFinish = (refundData: RefundFormData) => {
    const requestData = mapToVoidRequestData(voidPermitData, refundData, -1 * amountToRefund);
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
      fax={fax}
      reason={reason}
      permitNumber={permit?.permitNumber}
      permitType={permit?.permitType}
      permitAction="void"
      onFinish={handleFinish}
    />
  );
};
