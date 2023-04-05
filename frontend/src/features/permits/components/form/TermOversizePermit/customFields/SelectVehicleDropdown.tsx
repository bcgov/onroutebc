import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  darken,
  lighten,
  styled,
} from "@mui/material";
import { SELECT_FIELD_STYLE } from "../../../../../../themes/orbcStyles";
import { Vehicle } from "../../../../../manageVehicles/types/managevehicles";
import { useFormContext } from "react-hook-form";
import "../TermOversizePermit.scss";

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
 * Sort Plates and Unit Number alphabetically
 * @param vehicleType string, either plate or unitNumber
 * @param options array of Vehicles (Power Units and Trailers)
 * @returns an array of sorted vehicles alphabetically
 */
const sortVehicles = (chooseFrom: string, options: Vehicle[] | undefined) => {
  if (!chooseFrom || !options) return [];

  const sortByPlateOrUnitNumber = (a: Vehicle, b: Vehicle) => {
    if (chooseFrom === "plate") {
      return a.plate > b.plate ? 1 : -1;
    }
    return a.unitNumber > b.unitNumber ? 1 : -1;
  };

  const sortByVehicleType = (a: Vehicle, b: Vehicle) => {
    if (a.vehicleType && b.vehicleType) {
      return a.vehicleType > b.vehicleType ? 1 : -1;
    }
    return 0;
  };

  const sorted = options?.sort((a, b) => {
    // If the vehicle types (powerUnit | trailer) are the same, sort by plate or unitnumber
    if (a.vehicleType?.toLowerCase() === b.vehicleType?.toLowerCase()) {
      return sortByPlateOrUnitNumber(a, b);
    }
    // else sort by vehicle type
    return sortByVehicleType(a, b);
  });
  return sorted;
};

/**
 * This simple MUI auto complete component with grouped data and without
 * integration with React Hook Forms
 *
 * From https://mui.com/material-ui/react-autocomplete/#grouped
 */
export const SelectVehicleDropdown = ({
  options,
  chooseFrom,
  label,
  width,
  setSelectedVehicle,
}: {
  options: Vehicle[] | undefined;
  chooseFrom: string;
  label: string;
  width: string;
  setSelectedVehicle: any;
}) => {
  // Sort vehicles alphabetically
  const sortedVehicles = sortVehicles(chooseFrom, options);

  const { resetField, setValue } = useFormContext();

  return (
    <FormControl margin="normal">
      <FormLabel className="select-field-form-label">{label}</FormLabel>
      <Autocomplete
        id="grouped-demo"
        onChange={(event: any, values: any, reason) => {
          if (reason === "clear") {
            setSelectedVehicle("");
            resetField("application.vehicleDetails");
            setValue("application.vehicleDetails", {
              vin: "",
              plate: "",
              make: "",
              year: "",
              countryCode: "",
              provinceCode: "",
            });
          } else {
            setSelectedVehicle(values.plate);
          }
        }}
        options={sortedVehicles}
        groupBy={(option) => option.vehicleType || ""}
        getOptionLabel={(option) => {
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
      />
    </FormControl>
  );
};
