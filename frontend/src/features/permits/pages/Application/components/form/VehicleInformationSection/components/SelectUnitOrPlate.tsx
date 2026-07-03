import {
  FormControl,
  FormLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import "./SelectUnitOrPlate.scss";
import { CustomSelectDisplayProps } from "../../../../../../../../common/types/formElements";
import { Optional } from "../../../../../../../../common/types/common";

export const SelectUnitOrPlate = ({
  value,
  label,
  onChange,
  menuItems,
  disabled = false,
}: {
  value: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
  menuItems: Optional<JSX.Element[]>;
  disabled?: boolean;
}) => (
  <FormControl
    margin="normal"
    className="select-unit-or-plate"
  >
    <FormLabel className="select-unit-or-plate__label">{label}</FormLabel>
    <Select
      className={
        `select-unit-or-plate__select ${disabled ? "select-unit-or-plate__select--disabled" : ""}`
      }
      value={value}
      onChange={onChange}
      SelectDisplayProps={
        {
          "data-testid": "select-unit-or-plate",
        } as CustomSelectDisplayProps
      }
      MenuProps={{
        className: "select-unit-or-plate__menu",
      }}
      readOnly={disabled}
      disabled={disabled}
    >
      {menuItems}
    </Select>
  </FormControl>
);
