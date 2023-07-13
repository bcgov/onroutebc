import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  darken,
  lighten,
  styled,
} from "@mui/material";

import "../../../TermOversize.scss";
import { SELECT_FIELD_STYLE } from "../../../../../../../themes/orbcStyles";
import {
  PowerUnit,
  Trailer,
  Vehicle,
} from "../../../../../../manageVehicles/types/managevehicles";

import { sortVehicles } from "../../../../../helpers/sorter";
import { removeIneligibleVehicles } from "../../../../../helpers/removeIneligibleVehicles";
import {
  TROS_INELIGIBLE_POWERUNITS,
  TROS_INELIGIBLE_TRAILERS,
} from "../../../../../constants/termOversizeConstants";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

/**
 * An MUI auto complete component used to search and select a vehicle in the TROS form.
 *
 * From https://mui.com/material-ui/react-autocomplete/#grouped
 */
export const SelectVehicleDropdown = ({
  chooseFrom,
  label,
  width,
  vehicleOptions,
  handleSelectVehicle,
  handleClearVehicle,
}: {
  chooseFrom: string;
  label: string;
  width: string;
  vehicleOptions: (PowerUnit | Trailer)[];
  handleSelectVehicle: (vehicle: Vehicle) => void;
  handleClearVehicle: () => void;
}) => {
  const sortedVehicles = sortVehicles(chooseFrom, vehicleOptions);
  // Temporary method to remove ineligible vehicles as per TROS policy.
  // Will be replaced by backend endpoint with optional query parameter
  const eligibleVehicles = removeIneligibleVehicles(
    sortedVehicles,
    TROS_INELIGIBLE_POWERUNITS,
    TROS_INELIGIBLE_TRAILERS
  );

  return (
    <FormControl margin="normal">
      <FormLabel className="select-field-form-label">{label}</FormLabel>
      <Autocomplete
        id="tros-select-vehicle"
        onChange={(_, value: Vehicle | null | undefined, reason) => {
          if (!value || (reason === "clear")) {
            handleClearVehicle();
          } else {
            handleSelectVehicle(value);
          }
        }}
        options={eligibleVehicles}
        groupBy={(option) => getDefaultRequiredVal("", option?.vehicleType)}
        getOptionLabel={(option) => {
          if (!option) return "";
          if (!option.unitNumber) option.unitNumber = "-";
          return chooseFrom == "plate" ? option.plate : option.unitNumber;
        }}
        sx={[
          SELECT_FIELD_STYLE.SELECT_FIELDSET,
          {
            ".MuiOutlinedInput-root .MuiAutocomplete-input": {
              padding: 0,
            },
            width: { width },
          },
        ]}
        renderOption={(props, option) => {
          if (!option) return "";
          return (
            <li {...props} key={option.vin}>
              {chooseFrom == "plate" ? option.plate : option.unitNumber}
            </li>
          );
        }}
        renderInput={(params) => <TextField sx={{ padding: 0 }} {...params} />}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        data-testid="select-vehicle"
      />
    </FormControl>
  );
};
