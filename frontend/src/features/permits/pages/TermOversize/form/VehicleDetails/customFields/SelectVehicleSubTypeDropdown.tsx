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
import { SELECT_FIELD_STYLE } from "../../../../../../../themes/orbcStyles";
import { VehicleType } from "../../../../../../manageVehicles/types/managevehicles";
import "../../../TermOversize.scss";
import { getErrorMessage } from "../../../../../../../common/components/form/CustomFormComponents";
import { BC_COLOURS } from "../../../../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../../../../context/ApplicationContext";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
} from "../../../../../../manageVehicles/apiManager/hooks";
import { mapTypeCodeToObject } from "../../../../../helpers/mappers";
import { sortVehicleSubTypes } from "../../../../../helpers/sorter";
import {
  TROS_INELIGIBLE_POWERUNITS,
  TROS_INELIGIBLE_TRAILERS,
} from "../../../../../constants/termOversizeConstants";

/**
 * An MUI auto complete component with
 * integration with React Hook Forms
 *
 * From https://mui.com/material-ui/react-autocomplete/
 */
export const SelectVehicleSubTypeDropdown = ({
  label,
  width,
  name,
  rules,
}: {
  label: string;
  width: string;
  name: string;
  rules: RegisterOptions;
}) => {
  const {
    register,
    watch,
    setValue,
    getFieldState,
    trigger,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const { applicationData } = useContext(ApplicationContext);
  const { data: powerUnitTypes } = usePowerUnitTypesQuery();
  const { data: trailerTypes } = useTrailerTypesQuery();
  const [options, setOptions] = useState<VehicleType[] | undefined>();
  const vehicleType = watch("application.vehicleDetails.vehicleType");

  const removeIneligibleVehicleTypes = (vehicles: VehicleType[]) => {
    let ineligibleList: VehicleType[];
    if (vehicleType === "powerUnit")
      ineligibleList = TROS_INELIGIBLE_POWERUNITS;
    if (vehicleType === "trailer") ineligibleList = TROS_INELIGIBLE_TRAILERS;

    vehicles.forEach((item, index) => {
      ineligibleList.forEach((x) => {
        if (item.typeCode === x.typeCode) vehicles.splice(index, 1);
      });
    });

    return vehicles;
  };

  useEffect(() => {
    if (vehicleType === "powerUnit") {
      setOptions(powerUnitTypes);
    } else if (vehicleType === "trailer") {
      setOptions(trailerTypes);
    }
  }, [vehicleType]);

  const { invalid } = getFieldState(name);

  // Sort vehicle subtypes alphabetically
  const sortedVehicles = sortVehicleSubTypes(vehicleType, options);
  const eligibleVehicles = removeIneligibleVehicleTypes(sortedVehicles);

  // The typecode used in the json request object. Example: FARMVEH
  const typecode = watch(name);

  // The following code is used to associate the typecode to the rest of the vehicle type object.
  // This allows the component to render the name of the type in plain english instead of displaying the typecode
  const [type, setType] = useState<VehicleType | undefined>(typecode);
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
    setType(typeObject);
  }, [typecode, applicationData]);

  return (
    <Box sx={{ width: width }}>
      <FormControl margin="normal" error={invalid}>
        <FormLabel className="select-field-form-label">{label}</FormLabel>
        <Autocomplete
          id="tros-vehicle-subtype-dropdown"
          options={eligibleVehicles || []}
          {...register(name, rules)}
          value={type || null}
          onChange={(e, option, reason) => {
            if (reason === "clear") {
              setValue(name, "");
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
