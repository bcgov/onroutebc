import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

type SelectPermitTypeProps = {
  permitTypes: Record<string, string>;
  onSelectCallback: (value: string[]) => void;
};

/**
 *
 * @param param0
 */

export const SelectPermitTypes = ({
  permitTypes,
  onSelectCallback,
}: SelectPermitTypeProps) => {
  const [selectedPermitTypes, setSelectedPermitTypes] = useState<string[]>(
    Object.keys(permitTypes),
  );

  const isAllPermitTypesSelected =
    permitTypes &&
    Object.keys(permitTypes).length === selectedPermitTypes.length;

  const onSelectPermitType = (
    event: SelectChangeEvent<typeof selectedPermitTypes>,
  ) => {
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

      setSelectedPermitTypes(() => newState);
      onSelectCallback(newState);
    }
  };

  return (
    <Select
      labelId="demo-multiple-name-label"
      id="demo-multiple-name"
      multiple
      defaultValue={Object.keys(permitTypes ?? [])}
      onChange={onSelectPermitType}
      renderValue={(selected) => {
        // console.log("selectedPermitTypes::", selectedPermitTypes);
        if (isAllPermitTypesSelected) return "All Permit Types";
        return selected.join(", ");
      }}
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
  );
};
