import {
  FormControl,
  FormLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import "./SelectPermitType.scss";
import { SELECT_FIELD_STYLE } from "../../../../../../themes/orbcStyles";
import { PERMIT_TYPES } from "../../../../types/PermitType";

export const SelectPermitType = ({
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
      defaultValue={PERMIT_TYPES.TROS}
      onChange={onChange}
      MenuProps={{
        ...SELECT_FIELD_STYLE.MENU_PROPS,
      }}
    >
      {menuItems}
    </Select>
  </FormControl>
);