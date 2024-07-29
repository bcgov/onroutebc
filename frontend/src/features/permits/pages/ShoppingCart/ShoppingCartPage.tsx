import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import "./ShoppingCartPage.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { isZeroAmount } from "../../helpers/feeSummary";
import { PermitPayFeeSummary } from "../Application/components/pay/PermitPayFeeSummary";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { useIssuePermits, useStartTransaction } from "../../hooks/hooks";
import { TRANSACTION_TYPES } from "../../types/payment";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentCardTypeCode,
} from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "../Application/components/pay/PaymentFailedBanner";
import { ChoosePaymentMethod } from "../Application/components/pay/ChoosePaymentMethod";
import {
  DEFAULT_EMPTY_CARD_TYPE,
  DEFAULT_EMPTY_PAYMENT_TYPE,
  getPPCPaymentMethodTypeCode,
  IcepayPaymentData,
  PPCPaymentData,
  PPCPaymentType,
  ServiceBCPaymentData,
  isCashOrCheque,
  PaymentMethodData,
} from "../Application/components/pay/types/PaymentMethodData";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import { ShoppingCart } from "./components/ShoppingCart";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { useShoppingCart } from "./hooks/useShoppingCart";
import { useCheckOutdatedCart } from "./hooks/useCheckOutdatedCart";
import { EditCartItemDialog } from "../../components/cart/EditCartItemDialog";
import { UpdateCartDialog } from "../../components/cart/UpdateCartDialog";
import { BCeID_USER_AUTH_GROUP } from "../../../../common/authentication/types";
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
import { Loading } from "../../../../common/pages/Loading";

const AVAILABLE_STAFF_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
  PAYMENT_METHOD_TYPE_CODE.CASH,
  PAYMENT_METHOD_TYPE_CODE.CHEQUE,
  PAYMENT_METHOD_TYPE_CODE.POS,
  PAYMENT_METHOD_TYPE_CODE.GA,
];

const AVAILABLE_CV_PAYMENT_METHODS = [PAYMENT_METHOD_TYPE_CODE.WEB];

export const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { applicationData } = useContext(ApplicationContext);
  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const isCompanyAdmin = Boolean(
    userDetails?.userAuthGroup === BCeID_USER_AUTH_GROUP.COMPANY_ADMINISTRATOR,
  );
  const enableCartFilter = isStaffActingAsCompany || isCompanyAdmin;
  const [searchParams] = useSearchParams();
  const paymentFailed = applyWhenNotNullable(
    (queryParam) => queryParam === "true",
    searchParams.get("paymentFailed"),
    false,
  );

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
    outdatedApplicationNumbers,
    idOfCartItemToEdit,
    setOldCartItems,
    fetchStatusFor,
    setShowEditCartItemDialog,
    setShowUpdateCartDialog,
  } = useCheckOutdatedCart(showAllApplications, cartItems);

  const { mutation: startTransactionMutation, transaction } =
    useStartTransaction();

  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();

  // TODO additional logic needed so that FIN user see PPCPaymentOption or ServiceBCPaymentOption
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
    if (typeof transaction !== "undefined") {
      if (!isStaffActingAsCompany) {
        // CV Client
        if (!transaction?.url) {
          // Failed to generate transaction url
          navigate(SHOPPING_CART_ROUTES.DETAILS(true));
        } else {
          window.open(transaction.url, "_self");
        }
      } else if (!transaction) {
        // Staff payment failed
        navigate(SHOPPING_CART_ROUTES.DETAILS(true));
      } else {
        // Staff payment transaction created successfully, proceed to issue permit
        issuePermitMutation.mutate([...selectedIds]);

        // also update the cart and cart count
        cartQuery.refetch();
        refetchCartCount();
      }
    }
  }, [transaction, isStaffActingAsCompany]);

  useEffect(() => {
    const issueFailed = hasPermitsActionFailed(issueResults);
    if (issueFailed) {
      navigate(ERROR_ROUTES.ISSUANCE, { replace: true });
    } else if (getDefaultRequiredVal(0, issueResults?.success?.length) > 0) {
      // Navigate back to search page upon issue success
      navigate(PERMITS_ROUTES.SUCCESS, { replace: true });
    }
  }, [issueResults]);

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

  const handlePayWithPPC = (
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

  const handlePayWithServiceBC = (serviceBCOfficeId: string) => {
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

  const handlePay = (paymentMethodData: PaymentMethodData) => {
    const { paymentMethod, additionalPaymentData } = paymentMethodData;
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
        additionalPaymentData as PPCPaymentData;
      if (paymentType && paymentType !== DEFAULT_EMPTY_PAYMENT_TYPE) {
        handlePayWithPPC(paymentType, ppcTransactionId);
      }
    } else if (paymentMethod === PAYMENT_METHOD_TYPE_CODE.GA) {
      const { serviceBCOfficeId } =
        additionalPaymentData as ServiceBCPaymentData;
      handlePayWithServiceBC(serviceBCOfficeId);
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
        <ShoppingCart
          outdatedApplicationNumbers={outdatedApplicationNumbers}
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
          <ChoosePaymentMethod
            availablePaymentMethods={availablePaymentMethods}
          />

          {paymentFailed ? <PaymentFailedBanner /> : null}

          <PermitPayFeeSummary
            calculatedFee={selectedTotalFee}
            permitType={applicationData?.permitType}
            selectedItemsCount={selectedApplications.length}
            onPay={handleSubmit(handlePay)}
            transactionPending={startTransactionMutation.isPending}
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
        onUpdateCart={handleForceUpdateCart}
      />
    </div>
  );
};
