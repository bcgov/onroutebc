import { Box } from "@mui/material";
import { useContext, useEffect } from "react";

import "./TermOversizePay.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { calculateFeeByDuration } from "../../helpers/feeSummary";
import { ApplicationSummary } from "./components/pay/ApplicationSummary";
import { PermitPayFeeSummary } from "./components/pay/PermitPayFeeSummary";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Loading } from "../../../../common/pages/Loading";
import { useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment.d";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);

  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration)
  );

  const { 
    mutation: startTransactionMutation, 
    transaction, 
  } = useStartTransaction();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handlePay = () => {
    if (!applicationData?.permitId) {
      console.error("Invalid permit id");
      return;
    }
    
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodId: "1", // Hardcoded value for Web/MotiPay, still need to implement payment method (ie payBC, manual, etc)
      applicationDetails: [
        {
          applicationId: applicationData?.permitId,
          transactionAmount: calculatedFee,
        }
      ],
    });
  };

  if (typeof transaction !== "undefined") {
    if (!transaction?.url) {
      console.error("Invalid transaction url");
    } else {
      window.open(transaction.url, "_self");
    }
  }

  if (!applicationData?.permitId) {
    return <Loading />;
  }

  return (
    <>
      <ProgressBar />

      <Box className="payment">
        <ApplicationSummary
          permitType={applicationData?.permitType}
          applicationNumber={applicationData?.applicationNumber}
        />

        <PermitPayFeeSummary 
          calculatedFee={calculatedFee}
          permitType={applicationData?.permitType}
          onPay={handlePay}
        />
      </Box>
    </>
  );
};
