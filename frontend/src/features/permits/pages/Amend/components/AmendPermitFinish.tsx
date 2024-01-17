import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./AmendPermitFinish.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { calculateAmountToRefund } from "../../../helpers/feeSummary";
import { RefundPage } from "../../Refund/RefundPage";
import { RefundFormData } from "../../Refund/types/RefundFormData";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { mapToAmendRequestData } from "./helpers/mapper";
import { useIssuePermits, useStartTransaction } from "../../../hooks/hooks";
import { isValidTransaction } from "../../../helpers/payment";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { ERROR_ROUTES } from "../../../../../routes/constants";

export const AmendPermitFinish = () => {
  const navigate = useNavigate();
  const { permit, permitFormData, permitHistory, getLinks, afterFinishAmend } =
    useContext(AmendPermitContext);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

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

  useEffect(() => {
    if (typeof transaction !== "undefined") {
      // refund transaction response received
      if (!transaction) {
        // refund transaction failed
        console.error("Refund failed.");
        navigate(ERROR_ROUTES.UNEXPECTED);
      } else {
        // refund transaction successful, proceed to issue permit
        issuePermitMutation.mutate([permitId]);
      }
    }
  }, [transaction]);

  useEffect(() => {
    const issueFailed = hasPermitsActionFailed(issueResults);
    if (issueFailed) {
      console.error("Permit issuance failed.");
      navigate(ERROR_ROUTES.UNEXPECTED);
    } else if (issueResults && issueResults.success.length > 0) {
      // Navigate back to search page upon issue success
      afterFinishAmend();
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
