import { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { getMotiPaymentDetails } from "../../helpers/payment";
import { MotiPaymentDetails, Transaction } from "../../types/payment";
import { Loading } from "../../../../common/pages/Loading";
import { usePermitTransactionQuery, usePostTransaction } from "../../hooks/hooks";

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const postedTransaction = useRef(false);
  const [searchParams] = useSearchParams();
  const paymentDetails = getMotiPaymentDetails(searchParams);
  const transaction = mapTransactionDetails(paymentDetails);

  const { 
    mutation: postTransactionMutation,
    paymentApproved,
    message,
    setPaymentApproved,
  } = usePostTransaction(
    paymentDetails.messageText,
    paymentDetails.trnApproved
  );

  useEffect(() => {
    if (postedTransaction.current === false) {
      if (paymentDetails.trnApproved > 0) {
        postTransactionMutation.mutate(transaction);
        postedTransaction.current = true;
      } else {
        setPaymentApproved(false);
      }
    }
  }, [paymentDetails.trnApproved]);

  const {
    permitTransaction,
  } = usePermitTransactionQuery(
    transaction.transactionOrderNumber,
    paymentApproved === true, //permitIssued,
  );

  if (paymentApproved === false) {
    return (
      <Navigate 
        to={`/applications/failure/${message}`}
        replace={true}
      />
    );
  }
  
  if (permitTransaction?.permitId) {
    return (
      <Navigate 
        to={`/applications/success/${permitTransaction.permitId}`}
        replace={true}
      />
    );
  } 

  return <Loading />;
};

const mapTransactionDetails = (
  motiResponse: MotiPaymentDetails
): Transaction => {
  return {
    transactionType: motiResponse.trnType,
    transactionOrderNumber: motiResponse.trnOrderNumber,
    providerTransactionId: Number(motiResponse.trnId),
    transactionAmount: Number(motiResponse.trnAmount),
    approved: Number(motiResponse.trnApproved),
    authCode: motiResponse.authCode,
    cardType: motiResponse.cardType,
    transactionDate: motiResponse.trnDate,
    cvdId: Number(motiResponse.cvdId),
    paymentMethod: motiResponse.paymentMethod,
    paymentMethodId: 1, // TODO: change once different payment methods are implemented, currently 1 == MOTI Pay
    messageId: motiResponse.messageId,
    messageText: motiResponse.messageText,
  };
};
