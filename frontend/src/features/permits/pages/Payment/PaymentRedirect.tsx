import { useEffect, useState } from "react";
import { SuccessPage } from "../SuccessPage/SuccessPage";
import { getURLParameters } from "../../helpers/payment";

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
    setPaymentStatus(parameters.messageText);
  }, []);

  return paymentStatus === "Approved" ? (
    <SuccessPage />
  ) : (
    <div>{paymentStatus}</div>
  );
};
