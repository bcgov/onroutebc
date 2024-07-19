import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import "./SelectCreditLimit.scss";
import { Optional } from "../../../../common/types/common";

export const SelectCreditLimit = ({
  value,
  label,
  onChange,
  menuItems,
  invalid,
}: {
  value: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
  menuItems: Optional<JSX.Element[]>;
  invalid: boolean;
}) => (
  <FormControl margin="normal" className="select-credit-limit">
    <FormLabel className="select-credit-limit__label">{label}</FormLabel>

    <Select
      className="select-credit-limit__input"
      value={value}
      onChange={onChange}
      error={invalid}
      MenuProps={{
        className: "select-credit-limit__menu",
      }}
    >
      {menuItems}
    </Select>
    {invalid && (
      <FormHelperText className="custom-form-control__helper-text">
        This is a required field
      </FormHelperText>
    )}
  </FormControl>
);
