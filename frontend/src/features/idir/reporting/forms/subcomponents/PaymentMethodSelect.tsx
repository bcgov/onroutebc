import {
  Checkbox,
  FormControl,
  FormLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { CONSOLIDATED_PAYMENT_METHODS } from "../../../../../common/types/paymentMethods";
import { PaymentAndRefundDetailFormData } from "../../types/types";

/**
 * The permit type select component.
 */
export const PaymentMethodSelect = () => {
  const { setValue, watch } = useFormContext<PaymentAndRefundDetailFormData>();
  const issuedBy = watch("issuedBy");
  const selectedPaymentMethods = watch("paymentMethods");
  const isAllPaymentMethodsSelected =
    Object.keys(CONSOLIDATED_PAYMENT_METHODS).length ===
    selectedPaymentMethods?.length;

  /**
   * Updates the selected payment methods.
   * @param event The select event containing the selected values.
   */
  const onSelectPaymentMethod = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "All Payment Methods") {
      setValue(
        "paymentMethods",
        selectedPaymentMethods?.length ===
          Object.keys(CONSOLIDATED_PAYMENT_METHODS).length
          ? []
          : Object.keys(CONSOLIDATED_PAYMENT_METHODS),
      );
      return;
    }
    setValue("paymentMethods", value as string[]);
  };
  return (
    <>
      <FormControl
        sx={{ width: "274px" }}
        className="custom-form-control"
        margin="normal"
        disabled={issuedBy.length === 0}
      >
        <FormLabel
          className="custom-form-control__label"
          id="payment-method-select-label"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          Payment Method
        </FormLabel>
        <Select
          labelId="payment-method-select-label"
          id="payment-method-select"
          multiple
          onChange={onSelectPaymentMethod}
          renderValue={(selected) => {
            if (isAllPaymentMethodsSelected) return "All Payment Methods";
            return selected.join(", ");
          }}
          input={<OutlinedInput />}
          value={selectedPaymentMethods}
          MenuProps={{
            autoFocus: false,
          }}
        >
          <MenuItem key={"All Payment Methods"} value={"All Payment Methods"}>
            <Checkbox checked={isAllPaymentMethodsSelected} />
            <ListItemText primary={"All Payment Methods"} />
          </MenuItem>
          {Object.keys(CONSOLIDATED_PAYMENT_METHODS).map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox
                checked={
                  selectedPaymentMethods &&
                  selectedPaymentMethods.indexOf(key) > -1
                }
              />
              <ListItemText primary={key} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
