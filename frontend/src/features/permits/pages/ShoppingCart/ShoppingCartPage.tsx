/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import "./ShoppingCartPage.scss";
import { isZeroAmount } from "../../helpers/feeSummary";
import { PermitPayFeeSummary } from "../Application/components/pay/PermitPayFeeSummary";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { useIssuePermits, useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment";
import { PaymentFailedBanner } from "../Application/components/pay/PaymentFailedBanner";
import { ChoosePaymentMethod } from "../Application/components/pay/ChoosePaymentMethod";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import { ShoppingCart } from "./components/ShoppingCart";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { useShoppingCart } from "./hooks/useShoppingCart";
import { useCheckOutdatedCart } from "./hooks/useCheckOutdatedCart";
import { EditCartItemDialog } from "./components/EditCartItemDialog";
import { UpdateCartDialog } from "./components/UpdateCartDialog";
import { BCeID_USER_ROLE } from "../../../../common/authentication/types";
import { Loading } from "../../../../common/pages/Loading";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentCardTypeCode,
} from "../../../../common/types/paymentMethods";

import {
  DEFAULT_EMPTY_CARD_TYPE,
  DEFAULT_EMPTY_PAYMENT_TYPE,
  getPPCPaymentMethodTypeCode,
  IcepayPaymentData,
  InPersonPPCPaymentData,
  PPCPaymentType,
  GAPaymentData,
  isCashOrCheque,
  PaymentMethodData,
} from "../Application/components/pay/types/PaymentMethodData";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
  PERMITS_ROUTES,
  SHOPPING_CART_ROUTES,
} from "../../../../routes/constants";

import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../common/constants/constants";
import { ErrorAltBcGovBanner } from "../../../../common/components/banners/ErrorAltBcGovBanner";
import { ApplicationErrorsDialog } from "./components/ApplicationErrorsDialog";
import { PAYMENT_ERRORS } from "../../../policy/types/PaymentError";

const AVAILABLE_STAFF_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
  // POS represents all card types + CASH + CHEQUE
  PAYMENT_METHOD_TYPE_CODE.POS,
  PAYMENT_METHOD_TYPE_CODE.GA,
];

const AVAILABLE_CV_PAYMENT_METHODS = [PAYMENT_METHOD_TYPE_CODE.WEB];

export const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    getCompanyIdFromSession(),
    0,
  );
  const isStaffActingAsCompany = Boolean(idirUserDetails?.userRole);
  const isCompanyAdmin = Boolean(
    userDetails?.userRole === BCeID_USER_ROLE.COMPANY_ADMINISTRATOR,
  );
  const enableCartFilter = isStaffActingAsCompany || isCompanyAdmin;
  const [searchParams] = useSearchParams();

  const paymentFailed = applyWhenNotNullable(
    (queryParam) => queryParam === "true",
    searchParams.get("paymentFailed"),
    false,
  );

  const [showPaymentFailedBanner, setShowPaymentFailedBanner] =
    useState<boolean>(paymentFailed);

  const {
    removeFromCartMutation,
    cartQuery,
    cartItems,
    cartItemSelection,
    selectedTotalFee,
    showAllApplications,
    toggleSelectAll,
    handleCartFilterChange,
    handleSelectItem,
    handleDeselectItem,
    refetchCartCount,
  } = useShoppingCart(companyId, enableCartFilter);

  const isApplicationErrors = cartItems?.some(
    (item) => item.validationResults.violations.length,
  );

  const isFeeZero = isZeroAmount(selectedTotalFee);
  const selectedApplications = cartItemSelection.filter(
    (cartItem) => cartItem.selected,
  );
  const selectedIds = selectedApplications.map(
    (cartItem) => cartItem.applicationId,
  );

  const {
    showEditCartItemDialog,
    showUpdateCartDialog,
    idOfCartItemToEdit,
    setOldCartItems,
    fetchStatusFor,
    setShowEditCartItemDialog,
    setShowUpdateCartDialog,
  } = useCheckOutdatedCart(companyId, showAllApplications, cartItems);

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  const [hasIssued, setHasIssued] = useState<boolean>(false);
  const [showApplicationErrorsDialog, setShowApplicationErrorsDialog] =
    useState<boolean>(false);

  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();
  const { data: featureFlags } = useFeatureFlagsQuery();

  const availablePaymentMethods = isStaffActingAsCompany
    ? AVAILABLE_STAFF_PAYMENT_METHODS
    : AVAILABLE_CV_PAYMENT_METHODS;

  const formMethods = useForm<PaymentMethodData>({
    defaultValues: {
      paymentMethod: availablePaymentMethods[0],
      additionalPaymentData: {
        cardType: DEFAULT_EMPTY_CARD_TYPE,
        paymentType: DEFAULT_EMPTY_PAYMENT_TYPE,
        icepayTransactionId: "",
        ppcTransactionId: "",
        serviceBCOfficeId: "",
      },
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit } = formMethods;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // transaction is undefined when payment endpoint has not been requested
    // ie. "Pay Now" button has not been pressed
    if (typeof transaction !== "undefined") {
      if (!transaction) {
        // Payment failed - ie. transaction object is null
        navigate(SHOPPING_CART_ROUTES.DETAILS(true));
      } else if ((isFeeZero || isStaffActingAsCompany) && !hasIssued) {
        // If purchase was for no-fee permits, or if staff payment transaction was created successfully,
        // simply proceed to issue permits
        issuePermitMutation.mutate({
          companyId,
          applicationIds: [...selectedIds],
        });

        // prevent the issuePermitMutation from being called again
        setHasIssued(true);

        // also update the cart and cart count
        cartQuery.refetch();
        refetchCartCount();
      } else {
        // CV Client payment, anticipate PayBC transaction url
        if (!transaction?.url) {
          // Failed to generate transaction url
          navigate(SHOPPING_CART_ROUTES.DETAILS(true));
        } else {
          // Redirect to PayBC transaction url to continue payment
          window.open(transaction.url, "_self");
        }
      }
    }
  }, [transaction, isStaffActingAsCompany, isFeeZero, companyId, hasIssued]);

  useEffect(() => {
    const issueFailed = hasPermitsActionFailed(issueResults);
    if (issueFailed) {
      navigate(ERROR_ROUTES.ISSUANCE, { replace: true });
    } else if (getDefaultRequiredVal(0, issueResults?.success?.length) > 0) {
      // Navigate back to search page upon issue success
      navigate(PERMITS_ROUTES.SUCCESS, { replace: true });
    }
  }, [issueResults]);

  const {
    isError: startTransactionMutationFailed,
    error: startTransactionMutationError,
  } = startTransactionMutation;

  // TODO check LOA validation errors are being handled correctly
  useEffect(() => {
    if (startTransactionMutationFailed) {
      const errorCode =
        startTransactionMutationError.response?.data.error[0].errorCode;
      if (errorCode === PAYMENT_ERRORS.TRANS_INVALID_APPLICATION_STATUS) {
        setShowUpdateCartDialog(true);
      } else if (
        errorCode === PAYMENT_ERRORS.VALIDATION_FAILURE &&
        !isApplicationErrors
      ) {
        setShowUpdateCartDialog(true);
      } else if (
        errorCode === PAYMENT_ERRORS.VALIDATION_FAILURE &&
        isApplicationErrors
      ) {
        setShowApplicationErrorsDialog(true);
      } else {
        setShowPaymentFailedBanner(true);
      }
    }
  }, [startTransactionMutationFailed]);

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
        ...selectedApplications.map((application) => ({
          applicationId: application.applicationId,
          transactionAmount: application.fee,
        })),
      ],
      pgTransactionId: transactionId,
      pgCardType: cardType,
    });
  };

  const handlePayWithInPersonPPCPaymentOption = (
    paymentType: PPCPaymentType,
    transactionId: string,
  ) => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: isFeeZero
        ? PAYMENT_METHOD_TYPE_CODE.NP
        : getPPCPaymentMethodTypeCode(paymentType),
      paymentCardTypeCode: !isCashOrCheque(paymentType)
        ? (paymentType as PaymentCardTypeCode)
        : undefined,
      applicationDetails: [
        ...selectedApplications.map((application) => ({
          applicationId: application.applicationId,
          transactionAmount: application.fee,
        })),
      ],
      pgTransactionId: transactionId,
      pgCardType: isCashOrCheque(paymentType)
        ? undefined
        : (paymentType as PaymentCardTypeCode),
    });
  };

  const handlePayWithGA = (serviceBCOfficeId: string) => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: isFeeZero
        ? PAYMENT_METHOD_TYPE_CODE.NP
        : PAYMENT_METHOD_TYPE_CODE.GA,
      paymentCardTypeCode: undefined,
      applicationDetails: [
        ...selectedApplications.map((application) => ({
          applicationId: application.applicationId,
          transactionAmount: application.fee,
        })),
      ],
      pgTransactionId: serviceBCOfficeId,
      pgCardType: undefined,
    });
  };

  const handlePayWithPayBC = () => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: isFeeZero
        ? PAYMENT_METHOD_TYPE_CODE.NP
        : PAYMENT_METHOD_TYPE_CODE.WEB,
      applicationDetails: [
        ...selectedApplications.map((application) => ({
          applicationId: application.applicationId,
          transactionAmount: application.fee,
        })),
      ],
    });
  };

  // Paying for no-fee permits
  const handlePayForNoFee = () => {
    startTransactionMutation.mutate({
      transactionTypeId: TRANSACTION_TYPES.P,
      paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.NP,
      applicationDetails: [
        ...selectedApplications.map((application) => ({
          applicationId: application.applicationId,
          transactionAmount: 0,
        })),
      ],
    });
  };

  const handlePay = (paymentMethodData: PaymentMethodData) => {
    if (startTransactionMutation.isPending) return;

    const { paymentMethod, additionalPaymentData } = paymentMethodData;

    if (isFeeZero) {
      handlePayForNoFee();
      return;
    }

    if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.ICEPAY) {
      const { cardType, icepayTransactionId } =
        additionalPaymentData as IcepayPaymentData;

      if (
        cardType &&
        cardType !== DEFAULT_EMPTY_CARD_TYPE &&
        icepayTransactionId
      ) {
        handlePayWithIcepay(cardType, icepayTransactionId);
      }
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.POS) {
      const { paymentType, ppcTransactionId } =
        additionalPaymentData as InPersonPPCPaymentData;
      if (paymentType && paymentType !== DEFAULT_EMPTY_PAYMENT_TYPE) {
        handlePayWithInPersonPPCPaymentOption(paymentType, ppcTransactionId);
      }
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.GA) {
      const { serviceBCOfficeId } = additionalPaymentData as GAPaymentData;
      handlePayWithGA(serviceBCOfficeId);
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.WEB) {
      handlePayWithPayBC();
    }
  };

  const handleRemoveSelected = async () => {
    const selectedApplications = cartItemSelection.filter(
      (cartItem) => cartItem.selected,
    );

    if (selectedApplications.length === 0) return;

    const selectedApplicationIds = selectedApplications.map(
      (cartItem) => cartItem.applicationId,
    );

    const removeResult = await removeFromCartMutation.mutateAsync({
      companyId,
      applicationIds: selectedApplicationIds,
    });

    // TODO updateCartDialog not showing when item has already been removed from cart
    if (hasPermitsActionFailed(removeResult)) {
      // Removal failed, show update cart dialog
      setShowUpdateCartDialog(true);
    } else {
      // Reset old items since remove succeeded (no need to compare and display warning)
      setOldCartItems([]);
      cartQuery.refetch();
      refetchCartCount();
    }
  };

  const handleEditCartItem = (id: string) => {
    fetchStatusFor(id);
  };

  const handleConfirmEdit = async () => {
    if (idOfCartItemToEdit) {
      const removeResult = await removeFromCartMutation.mutateAsync({
        companyId,
        applicationIds: [idOfCartItemToEdit],
      });

      if (hasPermitsActionFailed(removeResult)) {
        // Record current items (before refetch) as old items for comparison
        setOldCartItems([...cartItemSelection]);
        cartQuery.refetch();
        refetchCartCount();
      } else {
        // Close the edit dialog and navigate to edit application
        setOldCartItems([]);
        setShowEditCartItemDialog(false);
        refetchCartCount();
        navigate(APPLICATIONS_ROUTES.DETAILS(idOfCartItemToEdit));
      }
    }
  };

  const handleForceUpdateCart = () => {
    setOldCartItems([...cartItemSelection]);
    cartQuery.refetch();
    refetchCartCount();
    setShowUpdateCartDialog(false);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
  }

  if (issuePermitMutation.isPending) {
    return <Loading />;
  }

  return (
    <div className="shopping-cart-page">
      <Box className="shopping-cart-page__left-container">
        <InfoBcGovBanner
          className="shopping-cart-page__banner"
          msg={<strong>Know your shopping cart.</strong>}
          additionalInfo={
            <div>
              <div>{BANNER_MESSAGES.KNOW_YOUR_SHOPPING_CART}</div>
              <br></br>
              <div>
                Have any questions? Please contact the Provincial Permit Centre.
                Toll-free: <strong>{TOLL_FREE_NUMBER}</strong> or Email:{" "}
                <strong>{PPC_EMAIL}</strong>
              </div>
            </div>
          }
        />

        {isApplicationErrors && (
          <ErrorAltBcGovBanner
            className="shopping-cart-page__banner"
            msg={
              <strong>Your shopping cart has invalid application(s).</strong>
            }
            additionalInfo={
              BANNER_MESSAGES.YOUR_SHOPPING_CART_CANNOT_BE_COMPLETED
            }
          />
        )}

        <ShoppingCart
          showCartFilter={enableCartFilter}
          showAllApplications={showAllApplications}
          cartItemSelection={cartItemSelection}
          toggleSelectAll={toggleSelectAll}
          handleCartFilterChange={handleCartFilterChange}
          handleSelectItem={handleSelectItem}
          handleDeselectItem={handleDeselectItem}
          handleRemoveSelected={handleRemoveSelected}
          handleEditCartItem={handleEditCartItem}
        />
      </Box>

      <Box className="shopping-cart-page__right-container">
        <FormProvider {...formMethods}>
          {!isFeeZero &&
          ((isStaffActingAsCompany &&
            featureFlags?.["STAFF-CAN-PAY"] === "ENABLED") ||
            !isStaffActingAsCompany) ? (
            <ChoosePaymentMethod
              availablePaymentMethods={availablePaymentMethods}
              showPayInPersonInfo={!isStaffActingAsCompany}
            />
          ) : null}

          {showPaymentFailedBanner ? <PaymentFailedBanner /> : null}

          <PermitPayFeeSummary
            calculatedFee={selectedTotalFee}
            selectedItemsCount={selectedApplications.length}
            onPay={handleSubmit(handlePay)}
            transactionPending={startTransactionMutation.isPending}
            disablePayNowButton={cartItems?.length === 0}
          />
        </FormProvider>
      </Box>

      <EditCartItemDialog
        shouldOpen={showEditCartItemDialog}
        handleCancel={() => setShowEditCartItemDialog(false)}
        handleEdit={handleConfirmEdit}
      />

      <UpdateCartDialog
        shouldOpen={showUpdateCartDialog}
        handleClose={() => setShowUpdateCartDialog(false)}
        onUpdateCart={handleForceUpdateCart}
      />

      <ApplicationErrorsDialog
        shouldOpen={showApplicationErrorsDialog}
        handleClose={() => setShowApplicationErrorsDialog(false)}
      />
    </div>
  );
};
