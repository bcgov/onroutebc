import { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { getMotiPaymentDetails } from "../../helpers/payment";
import { CompleteTransactionRequestData, MotiPaymentDetails } from "../../types/payment";
import { Loading } from "../../../../common/pages/Loading";
import { useCompleteTransaction, useIssuePermits } from "../../hooks/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

const getPermitIdsArray = (permitIds?: string | null) => {
  return getDefaultRequiredVal("", permitIds).split(",").filter(id => id !== "");
};

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const completedTransaction = useRef(false);
  const issuedPermit = useRef(false);
  const [searchParams] = useSearchParams();
  const permitIds = searchParams.get("permitIds");
  const transactionId = searchParams.get("transactionId");
  const paymentDetails = getMotiPaymentDetails(searchParams);
  const transaction = mapTransactionDetails(paymentDetails);

  const { 
    mutation: completeTransactionMutation,
    paymentApproved,
    message,
    setPaymentApproved,
  } = useCompleteTransaction(
    paymentDetails.messageText,
    paymentDetails.trnApproved
  );

  const {
    mutation: issuePermitsMutation,
    issueResults,
  } = useIssuePermits();

  const issueFailed = () => {
    if (!issueResults) return false; // since issue results might not be ready yet
    return issueResults.success.length === 0 
      || (issueResults.success.length === 1 && issueResults.success[0] === "")
      || (issueResults.failure.length > 0 && issueResults.failure[0] !== "");
  };

  useEffect(() => {
    if (completedTransaction.current === false) {
      if (paymentDetails.trnApproved > 0) {
        completeTransactionMutation.mutate({
          transactionId: getDefaultRequiredVal("", transactionId),
          transactionDetails: transaction,
        });
        completedTransaction.current = true;
      } else {
        setPaymentApproved(false);
      }
    }
  }, [paymentDetails.trnApproved]);

  useEffect(() => {
    if (issuedPermit.current === false) {
      const permitIdsArray = getPermitIdsArray(permitIds);
      if (paymentApproved === true && permitIdsArray.length > 0) {
        // Issue permit
        issuePermitsMutation.mutate(permitIdsArray);
        issuedPermit.current = true;
      }
    }
  }, [paymentApproved, permitIds]);

  if (paymentApproved === false) {
    return (
      <Navigate 
        to={`/applications/failure/${message}`}
        replace={true}
      />
    );
  }
  
  if (issueResults) {
    if (issueFailed()) {
      const permitIssueFailedMsg = `Permit issue failed for ids ${issueResults.failure.join(",")}`;
      return (
        <Navigate 
          to={`/applications/failure/${permitIssueFailedMsg}`}
          replace={true}
        />
      );
    }
    return (
      <Navigate 
        to={`/applications/success/${issueResults.success[0]}`}
        replace={true}
      />
    );
  } 

  return <Loading />;
};

const mapTransactionDetails = (
  motiResponse: MotiPaymentDetails
): CompleteTransactionRequestData => {
  return {
    pgTransactionId: motiResponse.trnId,
    pgApproved: Number(motiResponse.trnApproved),
    pgAuthCode: motiResponse.authCode,
    pgCardType: motiResponse.cardType,
    pgTransactionDate: motiResponse.trnDate,
    pgCvdId: Number(motiResponse.cvdId),
    pgPaymentMethod: motiResponse.paymentMethod,
    pgMessageId: Number(motiResponse.messageId),
    pgMessageText: motiResponse.messageText,
  };
};
