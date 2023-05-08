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

  const { handleSubmit, setValue } = formMethods;

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
    if (powerUnit?.powerUnitId) {
      const powerUnitToBeUpdated = data as PowerUnit;
      const result = await updatePowerUnitMutation.mutateAsync({
        powerUnitId: powerUnit?.powerUnitId,
        powerUnit: powerUnitToBeUpdated,
      });
      if (result.ok) {
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
      const result = await addPowerUnitMutation.mutateAsync(powerUnitToBeAdded);
      if (result.ok) {
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
              rules: { required: true, maxLength: 20 },
              label: "Make",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.make",
              inValidMessage_i18: "vehicle.power-unit.required",
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "year",
              rules: {
                required: { value: true, message: "Year is required." },
                valueAsNumber: true,
                maxLength: 4,
                validate: {
                  isNumber: (v) => !isNaN(v) || "Must be a number",
                  lessThan1950: v => parseInt(v) > 1950 || "Year must not be less than 1950",
                },
              },
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
                required: { value: true, message: "VIN is required." },
                minLength: { value: 6, message: "Length must be 6" },
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
              rules: { required: true, maxLength: 10 },
              label: "Plate",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.plate",
              inValidMessage_i18: "vehicle.power-unit.required",
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
                  message: "Vehicle Sub-type is required.",
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
                required: { value: true, message: "Licensed GVW is required." },
                valueAsNumber: true,
                validate: {
                  isNumber: (v) => !isNaN(v) || "Must be a number",
                },
              },
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
                  message: "Please enter a number",
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
