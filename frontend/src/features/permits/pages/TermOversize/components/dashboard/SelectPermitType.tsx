import {
  FormControl,
  FormLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import "./SelectPermitType.scss";
import { SELECT_FIELD_STYLE } from "../../../../../../themes/orbcStyles";

export const SelectPermitType = ({
  value,
  label,
  onChange,
  menuItems,
}: {
  value: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
  menuItems: JSX.Element[] | undefined;
}) => (
  <FormControl 
    margin="normal"
    className="select-permit-type"
  >
    <FormLabel
      className="select-permit-type__label"
    >
      {label}
    </FormLabel>

    <Select
      className="select-permit-type__input"
      value={value}
      onChange={onChange}
      MenuProps={{
        ...SELECT_FIELD_STYLE.MENU_PROPS,
      }}
    >
      {menuItems}
    </Select>
  </FormControl>
);