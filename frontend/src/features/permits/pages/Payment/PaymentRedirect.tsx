import { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { getPayBCPaymentDetails } from "../../helpers/payment";
import { CompleteTransactionRequestData, PayBCPaymentDetails } from "../../types/payment";
import { Loading } from "../../../../common/pages/Loading";
import { useCompleteTransaction, useIssuePermits } from "../../hooks/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { DATE_FORMATS, toUtc } from "../../../../common/helpers/formatDate";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";

const PERMIT_ID_DELIM = ','
const PATH_DELIM = '?'

const getPermitIdsArray = (permitIds?: string | null) => {
  return getDefaultRequiredVal("", permitIds).split(PERMIT_ID_DELIM).filter(id => id !== "")
}

export const parseRedirectUriPath = (path?: string | null) => {
  const splitPath = path?.split(PATH_DELIM)
  let permitIds = ''
  let trnApproved = 0
  if (splitPath?.[0]) {
    permitIds = splitPath[0]
  }

  if (splitPath?.[1]) {
    trnApproved = parseInt(splitPath[1]?.split('=')?.[1])
  }
  
  return {permitIds, trnApproved}
}

const exportPathFromSearchParams = (params: URLSearchParams, trnApproved: number) => {
  const localParams = new URLSearchParams(params)
  localParams.delete('path')
  const updatedPath = localParams.toString()
  return encodeURIComponent(`trnApproved=${trnApproved}&` + updatedPath)
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
  const paymentDetails = getPayBCPaymentDetails(searchParams)
  const transaction = mapTransactionDetails(paymentDetails)

  const path = getDefaultRequiredVal("", searchParams.get("path"))
  const {permitIds, trnApproved} = parseRedirectUriPath(path)
  const transactionQueryString = exportPathFromSearchParams(searchParams, trnApproved)
  const transactionId = getDefaultRequiredVal("", searchParams.get("ref2"))
  
  const { 
    mutation: completeTransactionMutation,
    paymentApproved,
    message,
    setPaymentApproved,
  } = useCompleteTransaction(
    paymentDetails.messageText,
    paymentDetails.trnApproved
  )

  const {
    mutation: issuePermitsMutation,
    issueResults,
  } = useIssuePermits()

  const issueFailed = () => {
    if (!issueResults) return false; // since issue results might not be ready yet
    return issueResults.success.length === 0 
      || (issueResults.success.length === 1 && issueResults.success[0] === "")
      || (issueResults.failure.length > 0 && issueResults.failure[0] !== "");
  }

  useEffect(() => {
    if (completedTransaction.current === false) {
      if (paymentDetails.trnApproved > 0) {
        completeTransactionMutation.mutate({
          transactionId: getDefaultRequiredVal("", transactionId),
          transactionQueryString,
          transactionDetails: transaction,
        });
        completedTransaction.current = true;
      } else {
        setPaymentApproved(false);
      }
    }
  }, [paymentDetails.trnApproved])

  useEffect(() => {
    if (issuedPermit.current === false) {
      const permitIdsArray = getPermitIdsArray(permitIds)
      if (paymentApproved === true && permitIdsArray.length > 0) {
        // Issue permit
        issuePermitsMutation.mutate(permitIdsArray)
        issuedPermit.current = true
      }
    }
  }, [paymentApproved, permitIds])

  if (paymentApproved === false) {
    return (
      <Navigate 
        to={`${APPLICATIONS_ROUTES.FAILURE}/${message}`}
        replace={true}
      />
    )
  }
  
  if (issueResults) {
    if (issueFailed()) {
      const permitIssueFailedMsg = `Permit issue failed for ids ${issueResults.failure.join(",")}`;
      return (
        <Navigate 
          to={`${APPLICATIONS_ROUTES.FAILURE}/${permitIssueFailedMsg}`}
          replace={true}
        />
      );
    }
    return (
      <Navigate 
        to={`${APPLICATIONS_ROUTES.SUCCESS}/${issueResults.success[0]}`}
        replace={true}
      />
    );
  } 

  return <Loading />
};

const mapTransactionDetails = (
  paymentResponse: PayBCPaymentDetails
): CompleteTransactionRequestData => {
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
  }
}
