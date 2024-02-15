import { Box, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import "./TermOversizePay.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { calculateFeeByDuration, isZeroAmount } from "../../helpers/feeSummary";
import { ApplicationSummary } from "./components/pay/ApplicationSummary";
import { PermitPayFeeSummary } from "./components/pay/PermitPayFeeSummary";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment.d";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "./components/pay/PaymentFailedBanner";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../../../../common/constants/constants";
import { ChoosePaymentMethod } from "./components/pay/ChoosePaymentMethod";
import { PaymentMethodData } from "./components/pay/types/PaymentMethodData";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  APPLICATIONS_ROUTES,
  APPLICATION_STEPS,
} from "../../../../routes/constants";

const AVAILABLE_STAFF_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
];

const AVAILABLE_CV_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.WEB,
];

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const routeParams = useParams();
  const permitId = getDefaultRequiredVal("", routeParams.permitId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentFailed = applyWhenNotNullable(
    (queryParam) => queryParam === "true",
    searchParams.get("paymentFailed"),
    false,
  );

  const calculatedFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration),
  );

  const isFeeZero = isZeroAmount(calculatedFee);

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  const availablePaymentMethods = 
    isStaffActingAsCompany ? AVAILABLE_STAFF_PAYMENT_METHODS : AVAILABLE_CV_PAYMENT_METHODS;

  const formMethods = useForm<PaymentMethodData>({
    defaultValues: {
      paymentMethod: availablePaymentMethods[0],
      cardType: "",
      transactionId: "",
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof transaction !== "undefined") {
      if (!transaction?.url) {
        navigate(APPLICATIONS_ROUTES.PAY(permitId, true));
      } else {
        window.open(transaction.url, "_self");
      }
    }
  }, [transaction]);

  const handlePayWithPayBC = () => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: isFeeZero
        ? PAYMENT_METHOD_TYPE_CODE.NP
        : PAYMENT_METHOD_TYPE_CODE.WEB,
      applicationDetails: [
        {
          applicationId: permitId,
          transactionAmount: calculatedFee,
        },
      ],
    });
  };

  const handlePayWithIcepay = () => {
    console.log("Pay with IcePay");
  };

  const handlePay = (paymentMethodData: PaymentMethodData) => {
    const { paymentMethod } = paymentMethodData;
    if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.ICEPAY) {
      handlePayWithIcepay();
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.WEB) {
      handlePayWithPayBC();
    }
  };

  return (
    <div className="pay-now-page">
      <Box className="pay-now-page__left-container">
        <ApplicationBreadcrumb
          permitId={permitId}
          applicationStep={APPLICATION_STEPS.PAY}
        />

        <ApplicationSummary
          permitType={applicationData?.permitType}
          applicationNumber={applicationData?.applicationNumber}
        />

        {!isStaffActingAsCompany ? (
          <Typography className="pay-now-page__contact" variant="h6">
            Have questions? Please contact the Provincial Permit Centre. Toll-free:
            {""}
            <span className="pay-contact pay-contact--phone">
              {" "}
              {TOLL_FREE_NUMBER}
            </span>{" "}
            or Email:{" "}
            <span className="pay-contact pay-contact--email">{PPC_EMAIL}</span>
          </Typography>
        ) : null}
      </Box>

      <Box className="pay-now-page__right-container">
        <FormProvider {...formMethods}>
          <ChoosePaymentMethod availablePaymentMethods={availablePaymentMethods} />

          {paymentFailed ? <PaymentFailedBanner /> : null}

          <PermitPayFeeSummary
            calculatedFee={calculatedFee}
            permitType={applicationData?.permitType}
            onPay={handleSubmit(handlePay)}
          />
        </FormProvider>
      </Box>
    </div>
  );
};
