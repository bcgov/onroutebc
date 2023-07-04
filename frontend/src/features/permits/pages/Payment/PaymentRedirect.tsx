import { useEffect, useState } from "react";
import { SuccessPage } from "../SuccessPage/SuccessPage";
import { getURLParameters } from "../../helpers/payment";
import { MotiPaymentDetails, Transaction } from "../../types/payment";
import { postTransaction } from "../../apiManager/permitsAPI";
import { Loading } from "../../../../common/pages/Loading";

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const [paymentStatus, setPaymentStatus] = useState<string>();

  useEffect(() => {
    const url = window.location.href;
    const parameters = getURLParameters(url);
    const transaction = mapTransactionDetails(parameters);
    handlePostTransaction(transaction, parameters.messageText);
  }, []);

  const handlePostTransaction = async (transaction: Transaction, messageText: string) => {
    const result = await postTransaction(transaction);
    if (result.status != 201){
      setPaymentStatus(result.response.data.message);
    }
    else{
      setPaymentStatus(messageText);
    }
  }

  if (!paymentStatus) return <Loading/>

  return paymentStatus === "Approved" ? (
    <SuccessPage />
  ) : (
    <div>{paymentStatus}</div>
  );
};


const mapTransactionDetails = (motiResponse: MotiPaymentDetails) : Transaction => {
  return {
    transactionId: Number(motiResponse.trnId),
    transactionType: motiResponse.trnType,
    transactionOrderNumber: motiResponse.trnOrderNumber,
    transactionAmount: Number(motiResponse.trnAmount),
    approved: Number(motiResponse.trnApproved),
    authCode: motiResponse.authCode,
    cardType: motiResponse.cardType,
    transactionDate: "TODO", // TODO
    cvdId: Number(motiResponse.cvdId),
    paymentMethod: motiResponse.paymentMethod,
    paymentMethodId: 0, // TODO: what is this?
    messageId: motiResponse.messageId,
    messageText: motiResponse.messageText,
  }
}