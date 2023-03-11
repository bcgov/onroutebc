import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button } from "@mui/material";
import "./VehicleForm.scss";
// import { AxleGroupForm } from "./AxleGroupForm";
import { CreatePowerUnit } from "../../types/managevehicles";
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
  const formMethods = useForm<CreatePowerUnit>({
    defaultValues: {
      country: powerUnit?.provinceId
        ? powerUnit?.provinceId?.split("-")[0]
        : "",
      province: powerUnit?.provinceId
        ? powerUnit?.provinceId?.split("-")[1]
        : "",
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
    },
  });
  const { register, handleSubmit, control, getValues } = formMethods;

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

  const commonFormProps = {
    control: control,
    register: register,
    feature: "power-unit",
    getValues: getValues,
  };

  return (
    <div>
      <FormProvider {...formMethods}>
        <div id="power-unit-form">
          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
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
            commonFormProps={commonFormProps}
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
            commonFormProps={commonFormProps}
            options={{
              name: "year",
              rules: { required: true, minLength: 4, maxLength: 4 },
              label: "Year",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.year",
              inValidMessage_i18: "vehicle.power-unit.required",
            }}
          />

          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "vin",
              rules: { required: true, minLength: 6, maxLength: 6 },
              label: "VIN",
              width: formFieldStyle.width,
              customHelperText: "last 6 digits",
            }}
            i18options={{
              label_i18: "vehicle.power-unit.vin",
              inValidMessage_i18: "vehicle.power-unit.required",
            }}
          />

          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
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
            commonFormProps={commonFormProps}
            options={{
              name: "powerUnitTypeCode",
              rules: { required: true },
              label: "Vehicle Sub-type",
              width: formFieldStyle.width,
              query: powerUnitTypesQuery,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.power-unit-type",
              inValidMessage_i18: "vehicle.power-unit.required",
            }}
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
            commonFormProps={commonFormProps}
            options={{
              name: "licensedGvw",
              rules: { required: true },
              label: "Licensed GVW",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.licensed-gvw",
              inValidMessage_i18: "vehicle.power-unit.required",
            }}
          />
          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "steerAxleTireSize",
              rules: { required: false },
              label: "Steer Axle Tire Size (mm)",
              width: formFieldStyle.width,
            }}
            i18options={{
              label_i18: "vehicle.power-unit.steer-axle-tire-size",
              inValidMessage_i18: "vehicle.power-unit.required",
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
          aria-label="Add Vehicle"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onAddVehicle)}
        >
          Add to Inventory
        </Button>
      </Box>
    </div>
  );
};
