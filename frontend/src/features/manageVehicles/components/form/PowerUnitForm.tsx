import {
  useForm,
  FormProvider,
  FieldValues,
  Controller,
} from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import "./VehicleForm.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormHelperText from "@mui/material/FormHelperText";
// import { AxleGroupForm } from "./AxleGroupForm";
import { CreatePowerUnit, PowerUnitType } from "../../types/managevehicles";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { addPowerUnit, getPowerUnitTypes } from "../../hooks/useVehiclesApi";
import { DisplaySnackBarOptions } from "../dashboard/Dashboard";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { CountryAndProvince } from "./subsections/CountryAndProvince";

/**
 * Props used by the power unit form.
 */
interface PowerUnitFormProps {
  displaySnackBar: (options: DisplaySnackBarOptions) => void;
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

  /**
   * Function to close the slide panel.
   */
  closeSlidePanel: () => void;
}

/**
 * @returns React component containing the form for adding or editing a power unit.
 */
export const PowerUnitForm = ({
  displaySnackBar,
  powerUnit,
  //powerUnitId,
  closeSlidePanel,
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
  const { register, handleSubmit, control } = formMethods;

  const queryClient = useQueryClient();

  const powerUnitTypesQuery = useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
  });

  const addVehicleQuery = useMutation({
    mutationFn: addPowerUnit,
    onSuccess: (response) => {
      if (response.status === 201) {
        queryClient.invalidateQueries(["powerUnits"]);
        closeSlidePanel();
        displaySnackBar({
          display: true,
          isError: false,
          messageI18NKey: "vehicle.add-vehicle.add-power-unit-success",
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
    width: "300px",
    marginLeft: "8px",
  };

  /**
   * Adds a vehicle.
   */
  const onAddVehicle = function (data: FieldValues) {
    const powerUnitToBeAdded = data as CreatePowerUnit;
    addVehicleQuery.mutate(powerUnitToBeAdded);
  };

  const ADD_VEHICLE_BTN_HEIGHT = "75px";
  const { t } = useTranslation();
  return (
    <div>
      <FormProvider {...formMethods}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="add-power-unit-content"
            id="add-power-unit-accordion-summary"
            className="bold-text"
          >
            {t("vehicle.power-unit-details")}
          </AccordionSummary>
          <AccordionDetails style={{ paddingBottom: ADD_VEHICLE_BTN_HEIGHT }}>
            <div id="power-unit-form">
              <div>
                <Controller
                  key="controller-powerunit-unitNumber"
                  name="unitNumber"
                  control={control}
                  rules={{ required: true, maxLength: 10 }}
                  defaultValue={powerUnit?.unitNumber || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-unit-number-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.unit-number")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-unit-number-label"
                          defaultValue={powerUnit?.unitNumber}
                          {...register("unitNumber", {
                            required: true,
                            maxLength: 10,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.unit-number.required")}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-make"
                  name="make"
                  control={control}
                  rules={{ required: false }}
                  defaultValue={powerUnit?.make || ""}
                  render={() => (
                    <>
                      <FormControl margin="normal">
                        <FormLabel
                          id="power-unit-make-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.make")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-make-label"
                          defaultValue={powerUnit?.make}
                          {...register("make", {
                            required: false,
                          })}
                        />
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-year"
                  name="year"
                  control={control}
                  rules={{ required: false }}
                  defaultValue={powerUnit?.year || undefined}
                  render={() => {
                    return (
                      <>
                        <FormControl margin="normal">
                          <FormLabel
                            id="power-unit-year-label"
                            sx={formFieldStyle}
                          >
                            {t("vehicle.power-unit.year")}
                          </FormLabel>
                          <OutlinedInput
                            aria-labelledby="power-unit-year-label"
                            defaultValue={powerUnit?.year}
                            {...register("year", {
                              required: false,
                              valueAsNumber: true,
                            })}
                          />
                        </FormControl>
                      </>
                    );
                  }}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-vin"
                  name="vin"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={powerUnit?.vin || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-vin-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.vin")}
                        </FormLabel>
                        <OutlinedInput
                          inputProps={{ maxLength: 17 }}
                          aria-labelledby="power-unit-vin-label"
                          {...register("vin", {
                            required: true,
                            minLength: 17,
                            maxLength: 17,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.vin.required")}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-plate"
                  name="plate"
                  control={control}
                  rules={{ required: true, maxLength: 10 }}
                  defaultValue={powerUnit?.plate || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-plate-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.plate")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-plate-label"
                          {...register("plate", {
                            required: true,
                            maxLength: 10,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.plate.required")}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-power-unit-type"
                  name="powerUnitTypeCode"
                  control={control}
                  rules={{ required: false }}
                  defaultValue={powerUnit?.powerUnitTypeCode || ""}
                  render={() => (
                    <>
                      <FormControl margin="normal">
                        <FormLabel
                          id="power-unit-power-unit-type-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.power-unit-type")}
                        </FormLabel>
                        <Select
                          aria-labelledby="power-unit-power-unit-type-label"
                          defaultValue={""}
                          {...register("powerUnitTypeCode", {
                            required: false,
                          })}
                        >
                          {powerUnitTypesQuery.data?.map(
                            (powerUnitType: PowerUnitType) => (
                              <MenuItem
                                key={`powerUnitType-${powerUnitType.typeCode}`}
                                value={powerUnitType.typeCode}
                              >
                                {powerUnitType.type}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <CountryAndProvince
                country={
                  powerUnit?.provinceId
                    ? powerUnit?.provinceId?.split("-")[0]
                    : ""
                }
                province={
                  powerUnit?.provinceId
                    ? powerUnit?.provinceId?.split("-")[1]
                    : ""
                }
              />
              <div>
                <Controller
                  key="controller-powerunit-licensed-gvw"
                  name="licensedGvw"
                  control={control}
                  rules={{ required: false }}
                  defaultValue={powerUnit?.licensedGvw || undefined}
                  render={() => (
                    <>
                      <FormControl margin="normal">
                        <FormLabel
                          id="power-unit-licensed-gvw-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.licensed-gvw")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-licensed-gvw-label"
                          // defaultValue={axleGroup?.axleGroupNumber}
                          {...register("licensedGvw", {
                            required: false,
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  key="controller-powerunit-steer-axle-tire-size"
                  name="steerAxleTireSize"
                  control={control}
                  rules={{ required: false }}
                  defaultValue={powerUnit?.steerAxleTireSize || undefined}
                  render={() => (
                    <>
                      <FormControl margin="normal">
                        <FormLabel
                          id="power-unit-steer-axle-tire-size-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.steer-axle-tire-size")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-steer-axle-tire-size-label"
                          // defaultValue={axleGroup?.axleGroupNumber}
                          {...register("steerAxleTireSize", {
                            required: false,
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                    </>
                  )}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        {/* {getAxleGroupForms()} */}
      </FormProvider>
      {/* <div>
        <Button
          color={"BC-Gov-PrimaryButton"}
          key="add-axle-group-button"
          className={"mt-5"}
          onClick={addAxleGroup}
        >
          {t("vehicle.form.add-axle-group")}
        </Button>
      </div> */}
      <div
        className="add-vehicle-button-container"
        style={{ height: ADD_VEHICLE_BTN_HEIGHT }}
      >
        <Button
          key="add-vehicle-button"
          aria-label="Add Vehicle"
          variant="contained"
          color="primary"
          sx={{
            width: "100%",
          }}
          onClick={handleSubmit(onAddVehicle)}
        >
          {t("vehicle.form.submit")}
        </Button>
      </div>
    </div>
  );
};
