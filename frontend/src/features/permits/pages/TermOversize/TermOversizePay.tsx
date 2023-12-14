import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

import "./TermOversizePay.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { calculateFeeByDuration, isZeroAmount } from "../../helpers/feeSummary";
import { ApplicationSummary } from "./components/pay/ApplicationSummary";
import { PermitPayFeeSummary } from "./components/pay/PermitPayFeeSummary";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment.d";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "./components/pay/PaymentFailedBanner";
import { APPLICATIONS_ROUTES, APPLICATION_STEPS } from "../../../../routes/constants";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);
  const [isBusy, setIsBusy] = useState(false);
  const routeParams = useParams();
  const permitId = getDefaultRequiredVal("", routeParams.permitId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentFailed = applyWhenNotNullable(
    queryParam => queryParam === "true",
    searchParams.get("paymentFailed"),
    false
  );



  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration),
  );

  const isFeeZero = isZeroAmount(calculatedFee);

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof transaction !== "undefined") {
      setIsBusy(false);
      if (!transaction?.url) {
        navigate(APPLICATIONS_ROUTES.PAY(permitId, true));
      } else {
        window.open(transaction.url, "_self");
      }
    }
  }, [transaction]);

  const handlePay = () => {
    setIsBusy(true);
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: 
        isFeeZero ? PAYMENT_METHOD_TYPE_CODE.NP : PAYMENT_METHOD_TYPE_CODE.WEB,
      applicationDetails: [
        {
          applicationId: permitId,
          transactionAmount: calculatedFee,
        },
      ],
    });
  };

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
          isBusy={isBusy}
        />
      </Box>
    </div>
  );
};
