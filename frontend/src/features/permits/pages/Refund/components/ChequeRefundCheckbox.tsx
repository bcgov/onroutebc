import { MRT_Cell } from "material-react-table";
import { RefundFormData } from "../types/RefundFormData";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../common/types/paymentMethods";

export const ChequeRefundCheckbox = ({
  cell,
}: {
  cell: MRT_Cell<RefundFormData>;
}) => {
  const formMethods = useFormContext();
  const { setValue, watch, getValues, register } = formMethods;

  const refundData = watch("refundData");

  const fieldIndex = cell.row.index;
  const fieldName = `refundData.${fieldIndex}.chequeRefund` as const;
  const fieldValue = refundData[fieldIndex].chequeRefund;
  // must use getValues to access fields outside of the one we are rendering in order to get latest values
  const refundAmount = getValues(`refundData.${fieldIndex}.refundAmount`);
  const refundTransactionId = getValues(
    `refundData.${fieldIndex}.refundTransactionId`,
  );
  const paymentMethodTypeCode = refundData[fieldIndex].paymentMethodTypeCode;
  const mustRefundByCheque = [
    PAYMENT_METHOD_TYPE_CODE.CASH,
    PAYMENT_METHOD_TYPE_CODE.CHEQUE,
    PAYMENT_METHOD_TYPE_CODE.GA,
  ].includes(paymentMethodTypeCode);
  const rowIsSelected = cell.row.getIsSelected();

  // local state necessary for 'chequeRefund' checkbox column to allow setting it to false when row is unselected
  const [isChecked, setIsChecked] = useState(fieldValue);

  // sync react-hook-form state when local state changes
  useEffect(() => {
    setValue(fieldName, isChecked);
  }, [setValue, isChecked]);

  // clear chequeRefund when row is unselected
  useEffect(() => {
    !rowIsSelected && setIsChecked(false);
  }, [rowIsSelected]);

  // clear chequeRefund when refundAmount is cleared
  useEffect(() => {
    if (refundAmount === "" && !mustRefundByCheque) {
      setIsChecked(false);
    }
  }, [refundAmount]);

  // if payment method is Cash, Cheque or GA, Cheque Refund should always be checked
  useEffect(() => {
    if (rowIsSelected && mustRefundByCheque) {
      setIsChecked(true);
    }
  }, [rowIsSelected]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          className="cheque-refund-checkbox"
          {...register(fieldName)}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={
            !rowIsSelected ||
            refundAmount === "" ||
            refundTransactionId !== "" ||
            mustRefundByCheque
          }
        />
      }
      label="Cheque Refund"
      classes={{
        root: "cheque-refund-label",
        disabled: "cheque-refund-label--disabled",
      }}
    />
  );
};
