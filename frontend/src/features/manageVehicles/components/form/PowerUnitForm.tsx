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
} from "../../apiManager/hooks";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SnackBarContext } from "../../../../App";

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
    provinceCode: powerUnit?.provinceCode || "",
    countryCode: powerUnit?.countryCode || "",
    unitNumber: powerUnit?.unitNumber || "",
    licensedGvw: (powerUnit?.licensedGvw as number) || undefined,
    make: powerUnit?.make || "",
    plate: powerUnit?.plate || "",
    powerUnitTypeCode: powerUnit?.powerUnitTypeCode || "",
    steerAxleTireSize: powerUnit?.steerAxleTireSize
      ? powerUnit?.steerAxleTireSize
      : undefined,
    vin: powerUnit?.vin ? powerUnit?.vin : "",
    year: powerUnit?.year ? powerUnit?.year : undefined,
  };

  const formMethods = useForm<PowerUnit>({
    defaultValues: powerUnitDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const addVehicleQuery = useAddPowerUnitMutation();
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
  const onAddVehicle = async (data: FieldValues) => {
    const powerUnitToBeAdded = data as PowerUnit;
    const result = await addVehicleQuery.mutateAsync(powerUnitToBeAdded);
    if (result.ok) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Power unit has been added successfully",
        isError: false,
      });
      navigate("../");
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
                pattern: {
                  value: /^\d+$/,
                  message: "Please enter a number",
                },
                minLength: { value: 4, message: "Min length is 4" },
                maxLength: 4,
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
                pattern: {
                  value: /^\d+$/,
                  message: "Please enter a number",
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
          onClick={handleSubmit(onAddVehicle)}
        >
          Add To Inventory
        </Button>
      </Box>
    </div>
  );
};
