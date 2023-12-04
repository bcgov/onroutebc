import { useContext, useEffect } from "react";

import "./AmendPermitFinish.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { calculateAmountToRefund } from "../../../helpers/feeSummary";
import { RefundPage } from "../../Refund/RefundPage";
import { RefundFormData } from "../../Refund/types/RefundFormData";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { mapToAmendRequestData } from "./helpers/mapper";
import { useIssuePermits, useStartTransaction } from "../../../hooks/hooks";
import { isValidTransaction } from "../../../helpers/payment";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

export const AmendPermitFinish = () => {
  const {
    permit,
    permitFormData,
    permitHistory,
    getLinks,
    afterFinishAmend,
  } = useContext(AmendPermitContext);

  const validTransactionHistory = permitHistory.filter(history =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgTransactionId));

  const permitId = applyWhenNotNullable(
    (id) => `${id}`,
    permitFormData?.permitId,
    "",
  );

  const amountToRefund =
    -1 *
    calculateAmountToRefund(
      validTransactionHistory,
      getDefaultRequiredVal(0, permitFormData?.permitData?.permitDuration),
    );

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();

  const issueFailed = () => {
    if (!issueResults) return false; // since issue results might not be ready yet
    return (
      issueResults.success.length === 0 ||
      (issueResults.success.length === 1 && issueResults.success[0] === "") ||
      (issueResults.failure.length > 0 && issueResults.failure[0] !== "")
    );
  };

  useEffect(() => {
    if (typeof transaction !== "undefined") {
      // refund transaction response received
      if (!transaction) {
        // refund transaction failed
        console.error("Refund failed.");
      } else {
        // refund transaction successful, proceed to issue permit
        issuePermitMutation.mutate([permitId]);
      }
    }
  }, [transaction]);

  useEffect(() => {
    if (typeof issueResults !== "undefined") {
      // issue permit response received
      if (!issueFailed()) {
        // Navigate back to search page upon issue success
        afterFinishAmend();
      } else {
        // Issue failed
        console.error("Permit issuance failed.");
      }
    }
  }, [issueResults]);

  const handleFinish = (refundData: RefundFormData) => {
    const requestData = mapToAmendRequestData(
      refundData,
      -1 * amountToRefund,
      permitId,
    );

    startTransactionMutation.mutate(requestData);
  };

  return (
    <div className="amend-permit-finish">
      <Breadcrumb links={getLinks()} />

      <RefundPage
        permitHistory={validTransactionHistory}
        amountToRefund={amountToRefund}
        permitNumber={permit?.permitNumber}
        permitType={permit?.permitType}
        permitAction="amend"
        onFinish={handleFinish}
      />
    </div>
  );
};
