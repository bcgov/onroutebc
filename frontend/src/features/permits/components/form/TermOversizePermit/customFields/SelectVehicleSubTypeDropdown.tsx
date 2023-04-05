import {
  Autocomplete,
  Box,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";

import { RegisterOptions, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { SELECT_FIELD_STYLE } from "../../../../../../themes/orbcStyles";
import { VehicleType } from "../../../../../manageVehicles/types/managevehicles";
import "../TermOversizePermit.scss";

/**
 * Sort Power Unit or Trailer Types alphabetically
 * @param vehicleType string, either powerUnit or trailer
 * @param options array of Vehicle Types
 * @returns an array of sorted vehicle types alphabetically
 */
const sortVehicleSubTypes = (
  vehicleType: string,
  options: VehicleType[] | undefined
) => {
  if (!vehicleType || !options) return [];
  options?.sort((a, b) => {
    if (a.type?.toLowerCase() === b.type?.toLowerCase()) {
      return a.typeCode > b.typeCode ? 1 : -1;
    }
    if (a.type && b.type) return a.type > b.type ? 1 : -1;
    return 0;
  });
  return options;
};

/**
 * An MUI auto complete component with
 * integration with React Hook Forms
 *
 * From https://mui.com/material-ui/react-autocomplete/
 */
export const SelectVehicleSubTypeDropdown = ({
  options,
  vehicleType,
  label,
  width,
  name,
  rules,
  powerUnitTypes,
  trailerTypes,
}: {
  options: VehicleType[] | undefined;
  vehicleType: string;
  label: string;
  width: string;
  name: string;
  rules: RegisterOptions;
  powerUnitTypes: VehicleType[] | undefined;
  trailerTypes: VehicleType[] | undefined;
}) => {
  const { register, watch, resetField, setValue } = useFormContext();

  // Sort vehicle subtypes alphabetically
  const sortedVehicles = sortVehicleSubTypes(vehicleType, options);

  // The typecode used in the json request object. Example: FARMVEH
  const typecode = watch(name);

  // The following code is used to associate the typecode to the rest of the vehicle type object.
  // This allows the component to render the name of the type in plain english instead of displaying the typecode
  const [type, setDescription] = useState<VehicleType | undefined>(typecode);
  useEffect(() => {
    if (powerUnitTypes && vehicleType === "powerUnit") {
      const typeObject = powerUnitTypes.find((v) => {
        return v.typeCode == typecode;
      });
      setDescription(typeObject);
    } else if (trailerTypes && vehicleType === "trailer") {
      const typeObject = trailerTypes.find((v) => {
        return v.typeCode == typecode;
      });
      setDescription(typeObject);
    } else {
      setDescription(undefined);
    }
  }, [typecode]);

  return (
    <Box sx={{ width: width }}>
      <FormControl margin="normal">
        <FormLabel className="select-field-form-label">{label}</FormLabel>
        <Autocomplete
          id="vehicle-subtype-autocomplete"
          options={sortedVehicles || []}
          {...register(name, rules)}
          value={type || null}
          onChange={(e, option, reason) => {
            if (reason === "clear") {
              resetField(name);
              return;
            }
            if (option) setValue(name, option.typeCode);
          }}
          sx={[
            SELECT_FIELD_STYLE.SELECT_FIELDSET,
            {
              ".MuiOutlinedInput-root .MuiAutocomplete-input": {
                padding: "0px 0px 0px 4px ",
              },
              width: { width },
            },
          ]}
          getOptionLabel={(option) => option.type || typecode}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.typeCode} value={option.typeCode}>
                {option.type}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField sx={{ padding: 0 }} {...params} />
          )}
        />
      </FormControl>
    </Box>
  );
};
