import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  darken,
  lighten,
  styled,
} from "@mui/material";
import { SELECT_FIELD_STYLE } from "../../../../../../../themes/orbcStyles";
import {
  PowerUnit,
  Trailer,
  Vehicle,
} from "../../../../../../manageVehicles/types/managevehicles";
import { useFormContext } from "react-hook-form";
import "../../../TermOversize.scss";
import { useVehiclesQuery } from "../../../../../../manageVehicles/apiManager/hooks";

import { mapVinToVehicleObject } from "../../../../../helpers/mappers";
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
  setSelectedVehicle,
}: {
  chooseFrom: string;
  label: string;
  width: string;
  setSelectedVehicle: any;
}) => {
  const { data } = useVehiclesQuery();
  const sortedVehicles = sortVehicles(chooseFrom, data);
  // Temporary method to remove ineligible vehicles as per TROS policy.
  // Will be replaced by backend endpoint with optional query parameter
  const eligibleVehicles = removeIneligibleVehicles(
    sortedVehicles,
    TROS_INELIGIBLE_POWERUNITS,
    TROS_INELIGIBLE_TRAILERS
  );

  const {
    setValue,
    formState: { isSubmitted },
    trigger,
  } = useFormContext();

  /**
   * Set all vehicle details fields to a blank string
   */
  const clearAllFields = () => {
    setSelectedVehicle("");
    setValue("application.vehicleDetails", {
      unitNumber: "",
      vin: "",
      plate: "",
      make: "",
      year: "",
      countryCode: "",
      provinceCode: "",
      vehicleType: "",
      vehicleSubType: "",
    });
  };

  /**
   * Using the useVehiclesQuery, set all the vehicle details fields to
   * the data corresponding to the selected vehicle.
   * @param selectedVehicle
   */
  const setAllFields = (selectedVehicle: Vehicle) => {
    const vehicle = mapVinToVehicleObject(data, selectedVehicle.vin);
    if (!vehicle) return;

    setSelectedVehicle(selectedVehicle.plate);
    setValue("application.vehicleDetails", {
      unitNumber: vehicle.unitNumber,
      vin: vehicle.vin,
      plate: vehicle.plate,
      make: vehicle.make,
      year: vehicle.year,
      countryCode: vehicle.countryCode,
      provinceCode: vehicle.provinceCode,
      vehicleType: vehicle.vehicleType,
    });

    if (vehicle.vehicleType === "powerUnit") {
      const powerUnit = vehicle as PowerUnit;
      setValue(
        "application.vehicleDetails.vehicleSubType",
        powerUnit.powerUnitTypeCode
      );
    }

    if (vehicle.vehicleType === "trailer") {
      const trailer = vehicle as Trailer;
      setValue(
        "application.vehicleDetails.vehicleSubType",
        trailer.trailerTypeCode
      );
    }
  };

  return (
    <FormControl margin="normal">
      <FormLabel className="select-field-form-label">{label}</FormLabel>
      <Autocomplete
        id="tros-select-vehicle"
        onChange={(event: any, value: Vehicle | null | undefined, reason) => {
          if (!value) return;
          if (reason === "clear") {
            clearAllFields();
          } else {
            setAllFields(value);
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
        // This onClose function fixes a bug where the Select component does not immediately
        // revalidate when selecting an option after an invalid form submission.
        // The validation needed to be triggered again manually
        onClose={async () => {
          if (isSubmitted) {
            const output = await trigger(
              "application.vehicleDetails.vehicleSubType"
            );
            if (!output) {
              trigger("application.vehicleDetails.vehicleSubType");
            }
          }
        }}
      />
    </FormControl>
  );
};
