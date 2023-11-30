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
import { PaymentAndRefundDetailFormData } from "../../types/types";

/**
 * The props needed for permit type select component.
 */
export type PermitTypeSelectProps = {
  /**
   * A key value pair containing the permit types and their full names.
   */
  permitTypes: Record<string, string> | undefined;
};

/**
 * The permit type select component.
 */
export const PermitTypeSelect = ({ permitTypes }: PermitTypeSelectProps) => {
  const { setValue, watch } = useFormContext<PaymentAndRefundDetailFormData>();
  const issuedBy = watch("issuedBy");
  const selectedPermitTypes = watch("permitType");
  const isAllPermitTypesSelected =
    permitTypes &&
    Object.keys(permitTypes).length === selectedPermitTypes.length;

  /**
   * Updates the selected permit types.
   * @param event The select event containing the selected values.
   */
  const onSelectPermitType = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (permitTypes) {
      const permitTypeKeys = Object.keys(permitTypes);
      const totalPermitTypes = permitTypeKeys.length;
      let newState: string[];
      if (value[value.length - 1] === "ALL") {
        newState =
          selectedPermitTypes.length === totalPermitTypes ? [] : permitTypeKeys;
      } else {
        newState = value as string[];
      }

      setValue("permitType", newState);
    }
  };
  return (
    <>
      <FormControl sx={{ width: "274px" }} disabled={issuedBy.length === 0}>
        <FormLabel
          className="custom-form-control__label"
          id="permit-type-select-label"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          Permit Type
        </FormLabel>
        <Select
          labelId="permit-type-select-label"
          id="permit-type-select"
          multiple
          onChange={onSelectPermitType}
          renderValue={(selected) => {
            if (isAllPermitTypesSelected) return "All Permit Types";
            return selected.join(", ");
          }}
          displayEmpty
          input={<OutlinedInput />}
          value={selectedPermitTypes}
          MenuProps={{
            autoFocus: false,
          }}
        >
          <MenuItem key="All Permit Types" value="ALL">
            <Checkbox checked={isAllPermitTypesSelected} />
            <ListItemText primary={"All Permit Types"} />
          </MenuItem>
          {permitTypes &&
            Object.keys(permitTypes).map((key) => {
              return (
                <MenuItem key={key} value={key}>
                  <Checkbox checked={selectedPermitTypes.indexOf(key) > -1} />
                  <ListItemText primary={key} />
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </>
  );
};
