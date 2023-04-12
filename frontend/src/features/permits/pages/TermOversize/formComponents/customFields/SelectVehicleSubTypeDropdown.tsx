import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";

import { RegisterOptions, useFormContext } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { SELECT_FIELD_STYLE } from "../../../../../../themes/orbcStyles";
import { VehicleType } from "../../../../../manageVehicles/types/managevehicles";
import "../../TermOversize.scss";
import { getErrorMessage } from "../../../../../../common/components/form/CustomFormComponents";
import { BC_COLOURS } from "../../../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../../../context/ApplicationContext";

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
 * Maps the typeCode (Example: GRADERS) to the TrailerType or PowerUnitType object, then return that object
 * @param typeCode
 * @param vehicleType
 * @param powerUnitTypes
 * @param trailerTypes
 * @returns A Vehicle Sub type object
 */
const mapTypeCodeToObject = (
  typeCode: string,
  vehicleType: string,
  powerUnitTypes: VehicleType[] | undefined,
  trailerTypes: VehicleType[] | undefined
) => {
  let typeObject = undefined;

  if (powerUnitTypes && vehicleType === "powerUnit") {
    typeObject = powerUnitTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  } else if (trailerTypes && vehicleType === "trailer") {
    typeObject = trailerTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  }

  return typeObject;
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
  const {
    register,
    watch,
    resetField,
    setValue,
    getFieldState,
    trigger,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const { applicationData } = useContext(ApplicationContext);

  const { invalid } = getFieldState(name);

  // Sort vehicle subtypes alphabetically
  const sortedVehicles = sortVehicleSubTypes(vehicleType, options);

  // The typecode used in the json request object. Example: FARMVEH
  const typecode = watch(name);

  // The following code is used to associate the typecode to the rest of the vehicle type object.
  // This allows the component to render the name of the type in plain english instead of displaying the typecode
  const [type, setDescription] = useState<VehicleType | undefined>(typecode);
  useEffect(() => {
    const typecodeFromContext =
      applicationData?.application.vehicleDetails?.vehicleSubType || "";
    const typeFromContext =
      applicationData?.application.vehicleDetails?.vehicleType || "";

    // Use data from permit context
    let typeObject = mapTypeCodeToObject(
      typecodeFromContext,
      typeFromContext,
      powerUnitTypes,
      trailerTypes
    );

    // If there is no application context data, then use data from React Hook Forms
    if (!typeObject) {
      typeObject = mapTypeCodeToObject(
        typecode,
        vehicleType,
        powerUnitTypes,
        trailerTypes
      );
    }
    setDescription(typeObject);
  }, [typecode, applicationData]);

  return (
    <Box sx={{ width: width }}>
      <FormControl margin="normal" error={invalid}>
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
              ".MuiOutlinedInput-root fieldset": {
                borderColor: invalid ? BC_COLOURS.bc_red : "#B2B5B6",
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
            <TextField
              sx={{
                padding: 0,
              }}
              {...params}
            />
          )}
          // This onClose function fixes a bug where the Select component does not immediately
          // revalidate when selecting an option after an invalid form submission.
          // The validation needed to be triggered again manually
          onClose={async () => {
            if (isSubmitted) {
              const output = await trigger(name);
              if (!output) {
                trigger(name);
              }
            }
          }}
        />
        {invalid && (
          <FormHelperText data-testid={`alert-${name}`} error>
            {getErrorMessage(errors, name)}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
