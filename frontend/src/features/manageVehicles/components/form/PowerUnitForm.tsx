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
import { addPowerUnit, getPowerUnitTypes } from "../../apiManager/vehiclesAPI";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { DisplaySnackBarOptions } from "../../../../common/components/snackbar/CustomSnackbar2";
import { CustomOutlinedInput } from "../../../../common/components/form/CustomFormComponents";

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
    width: "490px",
    marginLeft: "8px",
  };

  const inputHeight = {
    height: "48px",
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

  const commonFormProps = {
    control: control,
    register: register,
    feature: "power-unit",
  };

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
              <CustomOutlinedInput
                common={commonFormProps}
                name={"unitNumber"}
                rules={{ required: false, maxLength: 10 }}
                label={"Unit #"}
                inValidMessage={""}
                options={{
                  inputProps: { maxLength: 10 },
                  label_i18: "vehicle.power-unit.unit-number",
                }}
              />
              <CustomOutlinedInput
                common={commonFormProps}
                name={"make"}
                rules={{ required: true, maxLength: 20 }}
                label={"make"}
                inValidMessage={""}
                options={{
                  inputProps: { maxLength: 10 },
                  label_i18: "vehicle.power-unit.make",
                  inValidMessage_i18: "vehicle.power-unit.required",
                  inValidMessage_fieldName_i18: "Make",
                }}
              />
              <CustomOutlinedInput
                common={commonFormProps}
                name={"year"}
                rules={{ required: true, maxLength: 20 }}
                label={"year"}
                inValidMessage={""}
                options={{
                  inputProps: { maxLength: 4, minLength: 4 },
                  label_i18: "vehicle.power-unit.year",
                  inValidMessage_i18: "vehicle.power-unit.required",
                  inValidMessage_fieldName_i18: "Year",
                }}
              />
              {/* <div>
                <Controller
                  key="controller-powerunit-year"
                  name="year"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={powerUnit?.year || undefined}
                  render={({ fieldState: { invalid } }) => {
                    return (
                      <>
                        <FormControl margin="normal" error={invalid}>
                          <FormLabel
                            id="power-unit-year-label"
                            sx={formFieldStyle}
                          >
                            {t("vehicle.power-unit.year")}
                          </FormLabel>
                          <OutlinedInput
                            aria-labelledby="power-unit-year-label"
                            defaultValue={powerUnit?.year}
                            sx={inputHeight}
                            inputProps={{ maxLength: 4, minLength: 4 }}
                            {...register("year", {
                              required: true,
                              valueAsNumber: true,
                              maxLength: 4,
                              minLength: 4,
                            })}
                          />
                          {invalid && (
                            <FormHelperText error>
                              {t("vehicle.power-unit.required", {
                                fieldName: "Year",
                              })}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </>
                    );
                  }}
                />
              </div> */}
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
                          sx={inputHeight}
                          aria-labelledby="power-unit-vin-label"
                          {...register("vin", {
                            required: true,
                            minLength: 17,
                            maxLength: 17,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.required", {
                              fieldName: "VIN",
                            })}
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
                          inputProps={{ maxLength: 10 }}
                          sx={inputHeight}
                          {...register("plate", {
                            required: true,
                            maxLength: 10,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.required", {
                              fieldName: "Plate",
                            })}
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.powerUnitTypeCode || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-power-unit-type-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.power-unit-type")}
                        </FormLabel>
                        <Select
                          aria-labelledby="power-unit-power-unit-type-label"
                          defaultValue={""}
                          sx={inputHeight}
                          {...register("powerUnitTypeCode", {
                            required: true,
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
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.required", {
                              fieldName: "Power Unit Type",
                            })}
                          </FormHelperText>
                        )}
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
                width={"498px"}
              />
              <div>
                <Controller
                  key="controller-powerunit-licensed-gvw"
                  name="licensedGvw"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={powerUnit?.licensedGvw || undefined}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-licensed-gvw-label"
                          sx={formFieldStyle}
                        >
                          {t("vehicle.power-unit.licensed-gvw")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-licensed-gvw-label"
                          sx={inputHeight}
                          {...register("licensedGvw", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            {t("vehicle.power-unit.required", {
                              fieldName: "Licensed GVW",
                            })}
                          </FormHelperText>
                        )}
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
                          sx={inputHeight}
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
