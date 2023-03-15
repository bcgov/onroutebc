import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, MenuItem } from "@mui/material";
import "./VehicleForm.scss";
// import { AxleGroupForm } from "./AxleGroupForm";
import { CreatePowerUnit, PowerUnitType } from "../../types/managevehicles";
import { addPowerUnit, getPowerUnitTypes } from "../../apiManager/vehiclesAPI";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { VEHICLE_TYPES_ENUM } from "./constants";
import { useContext } from "react";
import { SnackBarContext } from "../../../../App";

/**
 * Props used by the power unit form.
 */
interface PowerUnitFormProps {
  /**
   * The power unit details to be displayed if in edit mode.
   * @deprecated This prop is only temporarily supported and scheduled to be removed.
   */
  powerUnit?: CreatePowerUnit;

  /**
   * The power unit id to be retrieved.
   * If valid and available, the form will be in an editable state.
   */
  powerUnitId?: string;

  setShowAddVehicle: React.Dispatch<
    React.SetStateAction<{
      showAddVehicle: boolean;
      vehicleType: VEHICLE_TYPES_ENUM;
    }>
  >;
}

/**
 * @returns React component containing the form for adding or editing a power unit.
 */
export const PowerUnitForm = ({
  powerUnit,
  setShowAddVehicle,
}: PowerUnitFormProps) => {
  const powerUnitDefaultValues = {
    country: powerUnit?.provinceId ? powerUnit?.provinceId?.split("-")[0] : "",
    province: powerUnit?.provinceId ? powerUnit?.provinceId?.split("-")[1] : "",
    unitNumber: powerUnit?.unitNumber || "",
    licensedGvw: (powerUnit?.licensedGvw as number) || undefined,
    make: powerUnit?.make || "",
    plate: powerUnit?.plate || "",
    powerUnitTypeCode: powerUnit?.powerUnitTypeCode || "",
    provinceId: powerUnit?.provinceId ? powerUnit?.provinceId : "",
    steerAxleTireSize: powerUnit?.steerAxleTireSize
      ? powerUnit?.steerAxleTireSize
      : undefined,
    vin: powerUnit?.vin ? powerUnit?.vin : "",
    year: powerUnit?.year ? powerUnit?.year : undefined,
  };

  const formMethods = useForm<CreatePowerUnit>({
    defaultValues: powerUnitDefaultValues,
    reValidateMode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const queryClient = useQueryClient();

  const powerUnitTypesQuery = useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
  });

  const snackBar = useContext(SnackBarContext);

  const addVehicleQuery = useMutation({
    mutationFn: addPowerUnit,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["powerUnits"]);

        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Power unit has been added successfully",
          isError: false,
        });

        setShowAddVehicle({
          showAddVehicle: false,
          vehicleType: VEHICLE_TYPES_ENUM.NONE,
        });
      } else {
        // Display Error in the form.
      }
    },
  });

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
  const onAddVehicle = function (data: FieldValues) {
    const powerUnitToBeAdded = data as CreatePowerUnit;
    addVehicleQuery.mutate(powerUnitToBeAdded);
  };

  const handleClose = () => {
    setShowAddVehicle({
      showAddVehicle: false,
      vehicleType: VEHICLE_TYPES_ENUM.NONE,
    });
  };

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
                  value: /^[0-9]+$/,
                  message: "Please enter a number",
                },
                minLength: { value: 4, message: "Min length is 4" },
                maxLength: 4,
              },
              label: "Year",
              width: formFieldStyle.width,
              inValidMessage: errors?.year?.message,
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
              inValidMessage: errors?.vin?.message,
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
              inValidMessage: errors?.powerUnitTypeCode?.message,
            }}
            menuOptions={powerUnitTypesQuery?.data?.map(
              (data: PowerUnitType) => (
                <MenuItem key={data.typeCode} value={data.typeCode}>
                  {data.type}
                </MenuItem>
              )
            )}
          />

          <CountryAndProvince
            country={
              powerUnit?.provinceId ? powerUnit?.provinceId?.split("-")[0] : ""
            }
            province={
              powerUnit?.provinceId ? powerUnit?.provinceId?.split("-")[1] : ""
            }
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
                  value: /^[0-9]+$/,
                  message: "Please enter a number",
                },
              },
              label: "Licensed GVW",
              width: formFieldStyle.width,
              inValidMessage: errors?.licensedGvw?.message,
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
                  value: /^[0-9]+$/,
                  message: "Please enter a number",
                },
              },
              label: "Steer Axle Tire Size (mm)",
              width: formFieldStyle.width,
              inValidMessage: errors?.steerAxleTireSize?.message,
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
