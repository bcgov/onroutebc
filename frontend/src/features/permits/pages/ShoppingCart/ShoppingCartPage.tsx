import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams, Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import "./ShoppingCartPage.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { calculateFeeByDuration, isZeroAmount } from "../../helpers/feeSummary";
import { ApplicationSummary } from "../Application/components/pay/ApplicationSummary";
import { PermitPayFeeSummary } from "../Application/components/pay/PermitPayFeeSummary";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { useIssuePermits, useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment";
import { PAYMENT_METHOD_TYPE_CODE, PaymentCardTypeCode } from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "../Application/components/pay/PaymentFailedBanner";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../../../../common/constants/constants";
import { ChoosePaymentMethod } from "../Application/components/pay/ChoosePaymentMethod";
import { DEFAULT_EMPTY_CARD_TYPE, PaymentMethodData } from "../Application/components/pay/types/PaymentMethodData";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import { ShoppingCart } from "./components/ShoppingCart";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  ERROR_ROUTES,
  PERMITS_ROUTES,
  SHOPPING_CART_ROUTES,
} from "../../../../routes/constants";

const AVAILABLE_STAFF_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
];

const AVAILABLE_CV_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.WEB,
];

export const ShoppingCartPage = () => {
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

  const { data: featureFlags } = useFeatureFlagsQuery();
  const enableShoppingCart = Boolean(featureFlags?.["SHOPPING_CART"] === "ENABLED");

  const companyId = getCompanyIdFromSession();

  const oldFee = calculateFeeByDuration(
    getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration),
  );
  const [calculatedFee, setCalculatedFee] = useState<number>(
    enableShoppingCart ? 0 : oldFee,
  );

  const isFeeZero = isZeroAmount(calculatedFee);

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();

  const availablePaymentMethods = 
    isStaffActingAsCompany ? AVAILABLE_STAFF_PAYMENT_METHODS : AVAILABLE_CV_PAYMENT_METHODS;

  const formMethods = useForm<PaymentMethodData>({
    defaultValues: {
      paymentMethod: availablePaymentMethods[0],
      cardType: DEFAULT_EMPTY_CARD_TYPE,
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
      if (!isStaffActingAsCompany) {
        // CV Client
        if (!transaction?.url) {
          // Failed to generate transaction url
          navigate(SHOPPING_CART_ROUTES.DETAILS(true));
        } else {
          window.open(transaction.url, "_self");
        }
      } else {
        // Staff acting on behalf of company
        if (!transaction) {
          // payment failed
          console.error("Payment failed.");
          navigate(ERROR_ROUTES.UNEXPECTED);
        } else {
          // payment transaction created successfully, proceed to issue permit
          issuePermitMutation.mutate([permitId]);
        }
      }
    }
  }, [transaction, isStaffActingAsCompany, permitId]);

  useEffect(() => {
    const issueFailed = hasPermitsActionFailed(issueResults);
    if (issueFailed) {
      console.error("Permit issuance failed.");
      navigate(ERROR_ROUTES.UNEXPECTED);
    } else if (getDefaultRequiredVal(0, issueResults?.success?.length) > 0) {
      // Navigate back to search page upon issue success
      navigate(PERMITS_ROUTES.SUCCESS(permitId), { replace: true });
    }
  }, [issueResults, permitId]);

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

  const handlePayWithIcepay = (
    cardType: PaymentCardTypeCode,
    transactionId: string,
  ) => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: isFeeZero
        ? PAYMENT_METHOD_TYPE_CODE.NP
        : PAYMENT_METHOD_TYPE_CODE.ICEPAY,
      paymentCardTypeCode: cardType,
      applicationDetails: [
        {
          applicationId: permitId,
          transactionAmount: calculatedFee,
        },
      ],
      pgTransactionId: transactionId,
      pgCardType: cardType,
    });
  };

  const handlePay = (paymentMethodData: PaymentMethodData) => {
    const { paymentMethod } = paymentMethodData;
    if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.ICEPAY) {
      if (
        paymentMethodData.cardType
        && paymentMethodData.cardType !== DEFAULT_EMPTY_CARD_TYPE
        && paymentMethodData.transactionId
      ) {
        handlePayWithIcepay(
          paymentMethodData.cardType,
          paymentMethodData.transactionId,
        );
      }
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.WEB) {
      handlePayWithPayBC();
    }
  };

  const handleTotalFeeChange = (totalFee: number) => {
    setCalculatedFee(totalFee);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
  }

  return (
    <div className="shopping-cart-page">
      <Box className="shopping-cart-page__left-container">
        {enableShoppingCart ? (
          <ShoppingCart
            onCartSelectionChange={handleTotalFeeChange}
            companyId={companyId}
          />
        ) : (
          <>
            <ApplicationSummary
              permitType={applicationData?.permitType}
              applicationNumber={applicationData?.applicationNumber}
            />

            {!isStaffActingAsCompany ? (
              <Typography className="shopping-cart-page__contact" variant="h6">
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
          </>
        )}
      </Box>

      <Box className="shopping-cart-page__right-container">
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
