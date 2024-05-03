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
import { PAYMENT_METHOD_TYPE_CODE, PaymentCardTypeCode } from "../../../../common/types/paymentMethods";
import { PaymentFailedBanner } from "../Application/components/pay/PaymentFailedBanner";
import { ChoosePaymentMethod } from "../Application/components/pay/ChoosePaymentMethod";
import { DEFAULT_EMPTY_CARD_TYPE, PaymentMethodData } from "../Application/components/pay/types/PaymentMethodData";
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

const AVAILABLE_STAFF_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.ICEPAY,
];

const AVAILABLE_CV_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPE_CODE.WEB,
];

export const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { applicationData } = useContext(ApplicationContext);
  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const isCompanyAdmin = Boolean(userDetails?.userAuthGroup === BCeID_USER_AUTH_GROUP.COMPANY_ADMINISTRATOR);
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
  const selectedApplications = cartItemSelection.filter(cartItem => cartItem.selected);
  const selectedIds = selectedApplications.map(cartItem => cartItem.applicationId);

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
          navigate(SHOPPING_CART_ROUTES.DETAILS(true));
        } else {
          // payment transaction created successfully, proceed to issue permit
          issuePermitMutation.mutate([
            ...selectedIds,
          ]);
        }
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
        ...selectedApplications.map(application => ({
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
        ...selectedApplications.map(application => ({
          applicationId: application.applicationId,
          transactionAmount: application.fee,
        })),
      ],
      pgTransactionId: transactionId,
      pgCardType: cardType,
    });
  };

  const handlePay = (paymentMethodData: PaymentMethodData) => {
    if (startTransactionMutation.isPending) {
      // Disable pay action while transaction is being created/processed (ie. "Pay Now" button has been clicked)
      return;
    }

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

  const handleRemoveSelected = async () => {
    const selectedApplications = cartItemSelection
      .filter(cartItem => cartItem.selected);
    
    if (selectedApplications.length === 0) return;

    const selectedApplicationIds = selectedApplications
      .map(cartItem => cartItem.applicationId);

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
          <ChoosePaymentMethod availablePaymentMethods={availablePaymentMethods} />

          {paymentFailed ? <PaymentFailedBanner /> : null}

          <PermitPayFeeSummary
            calculatedFee={selectedTotalFee}
            permitType={applicationData?.permitType}
            onPay={handleSubmit(handlePay)}
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
