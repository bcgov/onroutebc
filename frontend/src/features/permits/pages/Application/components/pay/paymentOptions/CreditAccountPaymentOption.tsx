import { FormControlLabel, Radio } from "@mui/material";
import {
  PAYMENT_METHOD_TYPE_CODE,
  PaymentMethodTypeCode,
} from "../../../../../../../common/types/paymentMethods";
import "./CreditAccountPaymentOption.scss";
import { RenderIf } from "../../../../../../../common/components/reusable/RenderIf";
import { useGetCreditAccountMetadataQuery } from "../../../../../../settings/hooks/creditAccount";
import { useContext } from "react";
import OnRouteBCContext from "../../../../../../../common/authentication/OnRouteBCContext";

const paymentMethod = PAYMENT_METHOD_TYPE_CODE.ACCOUNT;

export const CreditAccountPaymentOption = ({
  isSelected,
  handlePaymentMethodChange,
}: {
  isSelected: boolean;
  handlePaymentMethodChange: (
    selectedPaymentMethod: PaymentMethodTypeCode,
  ) => void;
}) => {
  const { companyId } = useContext(OnRouteBCContext);
  const {
    isPending,
    data: creditAccountMetadata,
    isError,
  } = useGetCreditAccountMetadataQuery(companyId as number, true);
  return (
    <RenderIf
      component={
        <div
          role="radio"
          onClick={() => handlePaymentMethodChange(paymentMethod)}
          onKeyDown={() => true}
          className={
            isSelected
              ? "payment-option payment-option--active"
              : "payment-option"
          }
        >
          <FormControlLabel
            className="label__credit-account"
            componentsProps={{
              typography: {
                className: "label__container",
              },
            }}
            label={<div className="label__text">Credit Account</div>}
            value={paymentMethod}
            control={<Radio key="pay-by-account" />}
          />
        </div>
      }
      featureFlag="CREDIT-ACCOUNT"
      permissionMatrixKeys={{
        permissionMatrixFeatureKey: "MISCELLANEOUS",
        permissionMatrixFunctionKey: "PAY_WITH_CREDIT_ACCOUNT",
      }}
      additionalConditionToCheck={() => {
        return (
          !isPending && !isError && creditAccountMetadata?.isValidPaymentMethod
        );
      }}
    />
  );
};
