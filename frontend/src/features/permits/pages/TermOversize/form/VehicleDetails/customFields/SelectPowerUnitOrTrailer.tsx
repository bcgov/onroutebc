import {
  FormControl,
  FormLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { SELECT_FIELD_STYLE } from "../../../../../../../themes/orbcStyles";

/**
 * This simple MUI select component without
 * integration with React Hook Forms
 */
export const SelectPowerUnitOrTrailer = ({
  value,
  label,
  onChange,
  menuItems,
  width,
}: {
  value: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
  menuItems: JSX.Element[] | undefined;
  width: string;
}) => (
  <FormControl margin="normal">
    <FormLabel sx={SELECT_FIELD_STYLE.FORM_LABEL}>{label}</FormLabel>
    <Select
      value={value}
      onChange={onChange}
      MenuProps={SELECT_FIELD_STYLE.MENU_PROPS}
      sx={[
        SELECT_FIELD_STYLE.SELECT_FIELDSET,
        {
          width: { width },
        },
      ]}
    >
      {menuItems}
    </Select>
  </FormControl>
);
