import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  darken,
  lighten,
  styled,
} from "@mui/material";
import { SELECT_FIELD_STYLE } from "../../../../../themes/orbcStyles";
import { Vehicle } from "../../../../manageVehicles/types/managevehicles";
import { useFormContext } from "react-hook-form";

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
 * This simple MUI auto complete component without
 * integration with React Hook Forms
 */
export const CustomSimpleAutoComplete = ({
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
  let sortedVehicles: Vehicle[];

  if (!chooseFrom || !options) {
    sortedVehicles = [];
  } else {
    sortedVehicles = options?.sort((a, b) => {
      if (a.vehicleType?.toLowerCase() === b.vehicleType?.toLowerCase()) {
        if (chooseFrom === "plate") {
          return a.plate > b.plate ? 1 : -1;
        }
        return a.unitNumber > b.unitNumber ? 1 : -1;
      }
      if (a.vehicleType && b.vehicleType)
        return a.vehicleType > b.vehicleType ? 1 : -1;
      return 0;
    });
  }

  const { resetField, setValue } = useFormContext();

  return (
    <FormControl margin="normal">
      <FormLabel sx={SELECT_FIELD_STYLE.FORM_LABEL}>{label}</FormLabel>
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
            return;
          } else {
            setSelectedVehicle(values.plate);
          }
        }}
        options={sortedVehicles}
        groupBy={(option) => option.vehicleType || ""}
        getOptionLabel={(option) => {
          if (!option.unitNumber) option.unitNumber = "";
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
