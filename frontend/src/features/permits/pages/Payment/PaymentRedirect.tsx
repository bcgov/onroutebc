import { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { getPayBCPaymentDetails } from "../../helpers/payment";
import { CompleteTransactionRequestData, PayBCPaymentDetails } from "../../types/payment";
import { Loading } from "../../../../common/pages/Loading";
import { useCompleteTransaction, useIssuePermits } from "../../hooks/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { DATE_FORMATS, toUtc } from "../../../../common/helpers/formatDate";

const getPermitIdsArray = (permitIds?: string | null) => {
  return getDefaultRequiredVal("", permitIds).split(";").filter(id => id !== "")
}

export const parseRedirectUriPath = (path?: string | null) => {
  const foo = path?.split(';')
  let permitIds = ''
  let transactionId = ''
  let trnApproved = 0
  if (foo && foo[0]) {
    //permitIds = foo[0].split(',')
    permitIds = foo[0]
  }

  if (foo && foo[1]) {
    const foo2 = foo[1].split('?')
    transactionId = foo2[0].split('=')?.[1]
    if (foo2 && foo2[1]) {
      trnApproved = parseInt(foo2[1].split('=')?.[1])
    }
  }
  return {permitIds, transactionId, trnApproved}
}


/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const completedTransaction = useRef(false)
  const issuedPermit = useRef(false)
  const [searchParams] = useSearchParams()
  //const permitIds = searchParams.get("permitIds");
  //const permitIds = searchParams.get("path");
  //const transactionId = searchParams.get("transactionId");
  const paymentDetails = getPayBCPaymentDetails(searchParams)
  const transaction = mapTransactionDetails(paymentDetails)

  const path = getDefaultRequiredVal("", searchParams.get("path"))
  const {permitIds, transactionId, trnApproved} = parseRedirectUriPath(path)
  
  console.log('searchParams', searchParams.toString())
  console.log('permitIds', permitIds)
  console.log('transactionId', transactionId)
  console.log('paymentDetails', paymentDetails)
  console.log('transaction', transaction)
  console.log('trnApproved', trnApproved)

  const { 
    mutation: completeTransactionMutation,
    paymentApproved,
    message,
    setPaymentApproved,
  } = useCompleteTransaction(
    getDefaultRequiredVal('', transactionId),
    transaction,
    paymentDetails.messageText,
    paymentDetails.trnApproved
  )

  const {
    mutation: issuePermitsMutation,
    issueResults,
  } = useIssuePermits()

  const issueFailed = () => {
    console.log('issueFailed? ', issueResults)
    if (!issueResults) return false; // since issue results might not be ready yet
    return issueResults.success.length === 0 
      || (issueResults.success.length === 1 && issueResults.success[0] === "")
      || (issueResults.failure.length > 0 && issueResults.failure[0] !== "");
  };

  useEffect(() => {
    if (completedTransaction.current === false) {
      if (paymentDetails.trnApproved > 0) {
        console.log('call completeTransactionMutation.mutate()')
        completeTransactionMutation.mutate();
        completedTransaction.current = true;
      } else {
        console.log('setting paymentApproved false')
        setPaymentApproved(false);
      }
    }
  }, [paymentDetails.trnApproved])

  useEffect(() => {
    console.log('issuedPermit', issuedPermit)
    if (issuedPermit.current === false) {
      const permitIdsArray = getPermitIdsArray(permitIds)
      console.log('permitIdsArray', permitIdsArray)
      if (paymentApproved === true && permitIdsArray.length > 0) {
        // Issue permit
        console.log('issue permit')
        issuePermitsMutation.mutate(permitIdsArray)
        issuedPermit.current = true
      }
    }
  }, [paymentApproved, permitIds])

  if (paymentApproved === false) {
    console.log('paymentApproved === false')
    return (
      <Navigate 
        to={`/applications/failure/${message}`}
        replace={true}
      />
    )
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
  paymentResponse: PayBCPaymentDetails
): CompleteTransactionRequestData => {
  console.log({
    pgTransactionId: paymentResponse.trnId,
    pgApproved: Number(paymentResponse.trnApproved),
    pgAuthCode: paymentResponse.authCode,
    pgCardType: paymentResponse.cardType,
    pgTransactionDate: toUtc(paymentResponse.trnDate, DATE_FORMATS.ISO8601),
    pgCvdId: Number(paymentResponse.cvdId),
    pgPaymentMethod: paymentResponse.paymentMethod,
    pgMessageId: Number(paymentResponse.messageId),
    pgMessageText: paymentResponse.messageText,
  })
  return {
    pgTransactionId: paymentResponse.trnId,
    pgApproved: Number(paymentResponse.trnApproved),
    pgAuthCode: paymentResponse.authCode,
    pgCardType: paymentResponse.cardType,
    pgTransactionDate: toUtc(paymentResponse.trnDate, DATE_FORMATS.ISO8601),
    pgCvdId: Number(paymentResponse.cvdId),
    pgPaymentMethod: paymentResponse.paymentMethod,
    pgMessageId: Number(paymentResponse.messageId),
    pgMessageText: paymentResponse.messageText,
  };
};
