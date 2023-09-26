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
import { DATE_FORMATS, dayjsToUtcStr, nowUtc } from "../../../../common/helpers/formatDate";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);

  if (!applicationData?.permitId) {
    return <Loading />;
  }

  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration)
  );

  const { 
    query, 
    setEnableQuery, 
  } = useStartTransaction(
    1, // Hardcoded value for Web/MotiPay, still need to implement payment method (ie payBC, manual, etc)
    dayjsToUtcStr(nowUtc(), DATE_FORMATS.ISO8601),
    calculatedFee,
    [applicationData.permitId]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handlePay = () => {
    setEnableQuery(true);
  };

  if (typeof query.data !== "undefined") {
    if (!query.data?.url) {
      console.error("Invalid transaction url");
    } else {
      window.open(query.data.url, "_self");
    }
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
