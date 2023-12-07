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
import { SELECT_FIELD_STYLE } from "../../../../../themes/orbcStyles";
import { useFormContext } from "react-hook-form";
import {
  PaymentAndRefundDetailFormData,
  REPORT_ISSUED_BY,
} from "../../types/types";

/**
 * The props used by the user select component.
 */
export type UserSelectProps = {
  permitIssuers: Record<string, string> | never[] | undefined;
};

/**
 * The user select component for report.
 */
export const UserSelect = ({ permitIssuers }: UserSelectProps) => {
  const { setValue, watch } = useFormContext<PaymentAndRefundDetailFormData>();
  const selectedUsers = watch("users");
  const issuedBy = watch("issuedBy");
  const isAllUsersSelected =
    permitIssuers &&
    Object.keys(permitIssuers).length === selectedUsers?.length;
  /**
   * Updates the selected users.
   * @param event The select event containing the selected values.
   */
  const onSelectUser = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (permitIssuers) {
      const userNames = Object.keys(permitIssuers);
      const totalUsers = userNames.length;
      let newState: string[];
      if (value[value.length - 1] === "ALL") {
        newState = selectedUsers?.length === totalUsers ? [] : userNames;
      } else {
        newState = value as string[];
      }
      setValue("users", newState);
    }
  };
  return (
    <FormControl
      sx={{ width: "274px" }}
      className="custom-form-control"
      margin="normal"
      disabled={!issuedBy.includes(REPORT_ISSUED_BY.PPC)}
    >
      <FormLabel
        className="custom-form-control__label"
        id="report-users-select-label"
        sx={{ fontWeight: "bold", marginBottom: "8px" }}
      >
        Users
      </FormLabel>
      <Select
        id="report-user-select"
        multiple
        onChange={onSelectUser}
        displayEmpty
        renderValue={(selected) => {
          if (isAllUsersSelected) return "All Users";
          return selected.join(", ");
        }}
        input={<OutlinedInput />}
        value={selectedUsers}
        aria-labelledby="users-select"
        sx={SELECT_FIELD_STYLE.SELECT_FIELDSET}
        inputProps={{
          "aria-label": "report-users-select-label",
        }}
        MenuProps={{
          autoFocus: false,
        }}
      >
        <MenuItem key="All Users" value="ALL">
          <Checkbox checked={isAllUsersSelected} />
          <ListItemText primary={"All Users"} />
        </MenuItem>
        {permitIssuers
          ? Object.keys(permitIssuers).map((key) => (
              <MenuItem key={key} value={key}>
                <Checkbox
                  checked={selectedUsers && selectedUsers.indexOf(key) > -1}
                />
                <ListItemText primary={key} />
              </MenuItem>
            ))
          : []}
      </Select>
    </FormControl>
  );
};
