import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, MenuItem } from "@mui/material";
import "./VehicleForm.scss";
// import { AxleGroupForm } from "./AxleGroupForm";
import { PowerUnit, VehicleType } from "../../types/managevehicles";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  useAddPowerUnitMutation,
  usePowerUnitTypesQuery,
  useUpdatePowerUnitMutation,
} from "../../apiManager/hooks";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SnackBarContext } from "../../../../App";
import { getDefaultRequiredVal, getDefaultNullableVal } from "../../../../common/helpers/util";
import { 
  invalidNumber, 
  invalidPlateLength, 
  invalidVINLength, 
  invalidYearMin, 
  requiredMessage 
} from "../../../../common/helpers/validationMessages";

/**
 * Props used by the power unit form.
 */
interface PowerUnitFormProps {
  /**
   * The power unit details to be displayed if in edit mode.
   */
  powerUnit?: PowerUnit;
}

/**
 * @returns React component containing the form for adding or editing a power unit.
 */
export const PowerUnitForm = ({ powerUnit }: PowerUnitFormProps) => {
  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const powerUnitDefaultValues = {
    provinceCode: getDefaultRequiredVal("", powerUnit?.provinceCode),
    countryCode: getDefaultRequiredVal("", powerUnit?.countryCode),
    unitNumber: getDefaultRequiredVal("", powerUnit?.unitNumber),
    licensedGvw: getDefaultNullableVal(powerUnit?.licensedGvw),
    make: getDefaultRequiredVal("", powerUnit?.make),
    plate: getDefaultRequiredVal("", powerUnit?.plate),
    powerUnitTypeCode: getDefaultRequiredVal("", powerUnit?.powerUnitTypeCode),
    steerAxleTireSize: getDefaultNullableVal(powerUnit?.steerAxleTireSize),
    vin: getDefaultRequiredVal("", powerUnit?.vin),
    year: getDefaultNullableVal(powerUnit?.year),
  };

  const formMethods = useForm<PowerUnit>({
    defaultValues: powerUnitDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const addPowerUnitMutation = useAddPowerUnitMutation();
  const updatePowerUnitMutation = useUpdatePowerUnitMutation();
  const snackBar = useContext(SnackBarContext);
  const navigate = useNavigate();

  /**
   * Custom css overrides for the form fields
   */
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  /**
   * Adds a vehicle.
   */
  const onAddOrUpdateVehicle = async (data: FieldValues) => {
    // return input as a number if it's a valid number value, or original value if invalid number
    const convertToNumberIfValid = (str?: string | null, valueToReturnWhenInvalid?: 0 | string | null) => {
      return str != null && str !== "" && !isNaN(Number(str)) ? Number(str) : valueToReturnWhenInvalid;
    };

    if (powerUnit?.powerUnitId) {
      const powerUnitToBeUpdated = data as PowerUnit;
      const result = await updatePowerUnitMutation.mutateAsync({
        powerUnitId: powerUnit?.powerUnitId,
        powerUnit: {
          ...powerUnitToBeUpdated,
          // need to explicitly convert form values to number here (since we can't use valueAsNumber prop)
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          year: convertToNumberIfValid(data.year, data.year as string) as any,
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          licensedGvw: convertToNumberIfValid(data.licensedGvw, data.licensedGvw as string) as any,
        },
      });
      if (result.status === 200) {
        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Changes Saved",
          alertType: "info",
        });
        navigate("../");
      }
    } else {
      const powerUnitToBeAdded = data as PowerUnit;
      const result = await addPowerUnitMutation.mutateAsync({
        ...powerUnitToBeAdded,
        // need to explicitly convert form values to number here (since we can't use valueAsNumber prop)
        year: !isNaN(Number(data.year)) ? Number(data.year) : data.year,
        licensedGvw: data.licensedGvw != null && data.licensedGvw !== "" && !isNaN(Number(data.licensedGvw)) ?
          Number(data.licensedGvw) : data.licensedGvw
      });
      if (result.status === 200 || result.status === 201) {
        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Power unit has been added successfully",
          alertType: "success"
        });
        navigate("../");
      }
    }
  };

  /**
   * Changed view to the main Vehicle Inventory page
   */
  const handleClose = () => {
    navigate("../");
  };

  /**
   * The name of this feature that is used for id's, keys, and associating form components
   */
  const FEATURE = "power-unit";

  return (
    <div>
      <FormProvider {...formMethods}>
        <div id="power-unit-form">
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "unitNumber",
              rules: { required: false, maxLength: 10 },
              label: "Unit #",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.unit-number",
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "make",
              rules: { 
                required: { value: true, message: requiredMessage() }, 
                maxLength: 20 
              },
              label: "Make",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.make",
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "year",
              rules: {
                required: { value: true, message: requiredMessage() },
                maxLength: 4,
                validate: {
                  isNumber: (v) => !isNaN(v) || invalidNumber(),
                  lessThan1950: v => parseInt(v) > 1950 || invalidYearMin(1950),
                },
              },
              inputType: "number",
              label: "Year",
              width: formFieldStyle.width,
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "vin",
              rules: {
                required: { value: true, message: requiredMessage() },
                minLength: { value: 6, message: invalidVINLength(6) },
                maxLength: 6,
              },
              label: "VIN",
              width: formFieldStyle.width,
              customHelperText: "last 6 digits",
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "plate",
              rules: { 
                required: { value: true, message: requiredMessage() }, 
                maxLength: { value: 10, message: invalidPlateLength(10) }
              },
              label: "Plate",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.plate",
            }}
          />

          <CustomFormComponent
            type="select"
            feature={FEATURE}
            options={{
              name: "powerUnitTypeCode",
              rules: {
                required: {
                  value: true,
                  message: requiredMessage(),
                },
              },
              label: "Vehicle Sub-type",
              width: formFieldStyle.width,
            }}
            menuOptions={powerUnitTypesQuery?.data?.map((data: VehicleType) => (
              <MenuItem key={data.typeCode} value={data.typeCode}>
                {data.type}
              </MenuItem>
            ))}
          />
          <CountryAndProvince
            feature={FEATURE}
            countryField="countryCode"
            provinceField="provinceCode"
            isProvinceRequired={true}
            width={formFieldStyle.width}
          />
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "licensedGvw",
              rules: {
                required: { value: true, message: requiredMessage() },
                validate: {
                  isNumber: (v) => !isNaN(v) || invalidNumber(),
                },
              },
              inputType: "number",
              label: "Licensed GVW",
              width: formFieldStyle.width,
            }}
          />
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "steerAxleTireSize",
              rules: {
                required: false,
                pattern: {
                  value: /^\d+$/,
                  message: invalidNumber(),
                },
              },
              label: "Steer Axle Tire Size (mm)",
              width: formFieldStyle.width,
            }}
          />
        </div>
        {/* {getAxleGroupForms()} */}
      </FormProvider>

      <Box sx={{ margin: "32px 0px" }}>
        <Button
          key="cancel-add-vehicle-button"
          aria-label="Cancel Add Vehicle"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ marginRight: "32px" }}
        >
          Cancel
        </Button>
        <Button
          key="add-vehicle-button"
          aria-label="Add To Inventory"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onAddOrUpdateVehicle)}
        >
          {powerUnit?.powerUnitId && "Save"}
          {!powerUnit?.powerUnitId && "Add To Inventory"}
        </Button>
      </Box>
    </div>
  );
};
