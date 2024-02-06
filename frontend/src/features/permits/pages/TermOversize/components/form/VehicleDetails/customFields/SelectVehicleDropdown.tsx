import { useEffect, useState } from "react";
import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  darken,
  lighten,
  styled,
} from "@mui/material";

import "./SelectVehicleDropdown.scss";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { SELECT_FIELD_STYLE } from "../../../../../../../../themes/orbcStyles";
import { sortVehicles } from "../../../../../../helpers/sorter";
import { removeIneligibleVehicles } from "../../../../../../helpers/removeIneligibleVehicles";
import {
  Nullable,
  Optional,
} from "../../../../../../../../common/types/common";
import { VehicleDetails } from "../../../../../../types/application";
import { VEHICLE_CHOOSE_FROM } from "../../../../../../constants/constants";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  Vehicle,
} from "../../../../../../../manageVehicles/types/Vehicle";

import {
  TROS_INELIGIBLE_POWERUNITS,
  TROS_INELIGIBLE_TRAILERS,
} from "../../../../../../constants/termOversizeConstants";

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
  selectedVehicle,
  label,
  width,
  vehicleOptions,
  handleSelectVehicle,
  handleClearVehicle,
}: {
  chooseFrom: string;
  selectedVehicle: Optional<VehicleDetails>;
  label: string;
  width: string;
  vehicleOptions: Vehicle[];
  handleSelectVehicle: (vehicle: Vehicle) => void;
  handleClearVehicle: () => void;
}) => {
  const sortedVehicles = sortVehicles(chooseFrom, vehicleOptions);
  // Temporary method to remove ineligible vehicles as per TROS policy.
  // Will be replaced by backend endpoint with optional query parameter
  const eligibleVehicles = removeIneligibleVehicles(
    sortedVehicles,
    TROS_INELIGIBLE_POWERUNITS,
    TROS_INELIGIBLE_TRAILERS,
  );

  const selectedOption = selectedVehicle
    ? getDefaultRequiredVal(
        null,
        eligibleVehicles.find((vehicle) =>
          selectedVehicle.vehicleType === VEHICLE_TYPES.TRAILER
            ? vehicle.vehicleType === VEHICLE_TYPES.TRAILER &&
              (vehicle as Trailer).trailerId === selectedVehicle.vehicleId
            : vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT &&
              (vehicle as PowerUnit).powerUnitId === selectedVehicle.vehicleId,
        ),
      )
    : null;

  const [vehicleTextValue, setVehicleTextValue] = useState<string>("");

  useEffect(() => {
    setVehicleTextValue(
      chooseFrom === VEHICLE_CHOOSE_FROM.PLATE
        ? getDefaultRequiredVal("", selectedOption?.plate)
        : getDefaultRequiredVal("", selectedOption?.unitNumber),
    );
  }, [selectedOption]);

  return (
    <FormControl margin="normal">
      <FormLabel className="select-field-form-label">{label}</FormLabel>
      <Autocomplete
        id="tros-select-vehicle"
        onChange={(_, value: Nullable<Vehicle>, reason) => {
          if (!value || reason === "clear") {
            handleClearVehicle();
          } else {
            handleSelectVehicle(value);
          }
        }}
        value={selectedOption}
        inputValue={vehicleTextValue}
        onInputChange={(_, value) => setVehicleTextValue(value)}
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

          const vehicleType =
            option.vehicleType === VEHICLE_TYPES.POWER_UNIT
              ? VEHICLE_TYPES.POWER_UNIT
              : VEHICLE_TYPES.TRAILER;

          const key =
            vehicleType === VEHICLE_TYPES.POWER_UNIT
              ? `power-unit-${(option as PowerUnit).powerUnitId}`
              : `trailer-${(option as Trailer).trailerId}`;

          return (
            <li
              {...props}
              key={key}
              data-testid={`select-vehicle-option-${vehicleType}`}
            >
              {chooseFrom == "plate" ? option.plate : option.unitNumber}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            sx={{ padding: 0 }}
            {...{
              ...params,
              inputProps: {
                ...params.inputProps,
                "data-testid": "select-vehicle-autocomplete",
              },
            }}
          />
        )}
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
