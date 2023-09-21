import { useContext } from "react";

import { VoidPermitContext } from "./context/VoidPermitContext";
import { RefundFormData } from "../Refund/types/RefundFormData";
import { ReadPermitDto } from "../../types/permit";
import { usePermitHistoryQuery } from "../../hooks/hooks";
import { calculateNetAmount } from "../../helpers/feeSummary";
import { RefundPage } from "../Refund/RefundPage";

export const FinishVoid = ({
  permit,
}: {
  permit: ReadPermitDto | null;
}) => {
  const { 
    voidPermitData: {
      email,
      fax,
      reason,
    },
  } = useContext(VoidPermitContext);

  const { 
    query: permitHistoryQuery, 
    permitHistory, 
  } = usePermitHistoryQuery(permit?.originalPermitId);

  const transactionHistory = permitHistoryQuery.isInitialLoading
    ? [] : permitHistory;

  const amountToRefund = -1 * calculateNetAmount(transactionHistory);  

  const handleFinish = (refundData: RefundFormData) => {
    console.log(refundData); //
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
