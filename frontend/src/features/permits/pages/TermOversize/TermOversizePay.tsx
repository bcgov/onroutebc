import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import "./TermOversizePay.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { calculateFeeByDuration } from "../../helpers/feeSummary";
import { ApplicationSummary } from "./components/pay/ApplicationSummary";
import { PermitPayFeeSummary } from "./components/pay/PermitPayFeeSummary";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Loading } from "../../../../common/pages/Loading";
import { useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment.d";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "./components/pay/PaymentFailedBanner";
import { APPLICATION_STEPS } from "../../../../routes/constants";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);
  const permitId = getDefaultRequiredVal("", applicationData?.permitId);
  const [searchParams] = useSearchParams();
  const paymentFailed = applyWhenNotNullable(
    queryParam => queryParam === "true",
    searchParams.get("paymentFailed"),
    false
  );

  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration),
  );

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof transaction !== "undefined") {
      if (!transaction?.url) {
        console.error("Invalid transaction url");
      } else {
        window.open(transaction.url, "_self");
      }
    }
  }, [transaction]);

  const handlePay = () => {
    if (!applicationData?.permitId) {
      console.error("Invalid permit id");
      return;
    }

    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB, // Hardcoded value for Web/PayBC, still need to implement payment method (ie payBC, manual, etc)
      applicationDetails: [
        {
          applicationId: applicationData?.permitId,
          transactionAmount: calculatedFee,
        },
      ],
    });
  };

  if (!applicationData?.permitId) {
    return <Loading />;
  }

  return (
    <div className="pay-now-page">
      <ApplicationBreadcrumb
        permitId={permitId}
        applicationStep={APPLICATION_STEPS.PAY}
      />

      <Box className="payment">
        <ApplicationSummary
          permitType={applicationData?.permitType}
          applicationNumber={applicationData?.applicationNumber}
        />

        {paymentFailed ? (
          <PaymentFailedBanner />
        ) : null}

        <PermitPayFeeSummary
          calculatedFee={calculatedFee}
          permitType={applicationData?.permitType}
          onPay={handlePay}
        />
      </Box>
    </div>
  );
};
