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
import { sortVehicles } from "../../../../../../helpers/sorter";
import { removeIneligibleVehicles } from "../../../../../../helpers/removeIneligibleVehicles";
import { VEHICLE_CHOOSE_FROM } from "../../../../../../constants/constants";
import { EMPTY_VEHICLE_UNIT_NUMBER } from "../../../../../../../../common/constants/constants";
import { Nullable } from "../../../../../../../../common/types/common";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";

import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  Vehicle,
  VehicleSubType,
} from "../../../../../../../manageVehicles/types/Vehicle";

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
 * An MUI auto complete component used to search and select a vehicle in the application form.
 *
 * From https://mui.com/material-ui/react-autocomplete/#grouped
 */
export const SelectVehicleDropdown = ({
  chooseFrom,
  selectedVehicle,
  label,
  vehicleOptions,
  handleSelectVehicle,
  handleClearVehicle,
  ineligiblePowerUnitSubtypes,
  ineligibleTrailerSubtypes,
}: {
  chooseFrom: string;
  selectedVehicle: Nullable<PermitVehicleDetails>;
  label: string;
  vehicleOptions: Vehicle[];
  handleSelectVehicle: (vehicle: Vehicle) => void;
  handleClearVehicle: () => void;
  ineligiblePowerUnitSubtypes: VehicleSubType[];
  ineligibleTrailerSubtypes: VehicleSubType[];
}) => {
  const sortedVehicles = sortVehicles(chooseFrom, vehicleOptions);

  // Temporary method to remove ineligible vehicles given policies for the permit type.
  // Will be replaced by backend endpoint with optional query parameter
  const eligibleVehicles = removeIneligibleVehicles(
    sortedVehicles,
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
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
    <FormControl margin="normal" className="select-vehicle-dropdown">
      <FormLabel className="select-vehicle-dropdown__label">{label}</FormLabel>
      <Autocomplete
        id="application-select-vehicle"
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
          if (!option.unitNumber) option.unitNumber = EMPTY_VEHICLE_UNIT_NUMBER;
          return chooseFrom == "plate" ? option.plate : option.unitNumber;
        }}
        className="select-vehicle-dropdown__autocomplete"
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
