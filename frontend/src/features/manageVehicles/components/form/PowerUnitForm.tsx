import { useCallback } from "react";
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
import { useState } from "react";
import { COUNTRIES_THAT_SUPPORT_PROVINCE } from "../../../../constants/countries";
import { MAKES } from "./constants";
import {
  CreatePowerUnit,
  AxleFrontGroup,
  AxleGroup,
  AxleType,
  UpdatePowerUnit,
  PowerUnitType,
} from "../../types";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  addPowerUnit,
  updatePowerUnit,
  getPowerUnitTypes,
} from "../../hooks/useVehiclesApi";
import { DisplaySnackBarOptions } from "../dashboard/Dashboard";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CountryAndProvince } from "./subsections/CountryAndProvince";

import CountriesAndStates from "../../../../constants/countries_and_states.json";

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
  powerUnitId?: string,
  
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
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    getValues,
    watch,
    resetField,
    control,
  } = formMethods;

  const queryClient = useQueryClient();

  const powerUnitTypesQuery = useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
  });

  const addVehicleQuery = useMutation({
    mutationFn: addPowerUnit,
    onSuccess: (response) => {
      closeSlidePanel();
      displaySnackBar({ display: true, isError: false, messageI18NKey: 'vehicle.add-vehicle.add-power-unit-success'})
      // if (response.status === 200) {
      //   queryClient.invalidateQueries(["powerUnits"]);
      //   closeSlidePanel();
      // } else {
      //   // Display Error in the form.
      // }
    },
  });

  // const countrySelected = watch("country");
  // const axleGroupTest = {
  //   axleFrontGroup: "Single",
  //   axleTypeFront: "Steering",
  //   axleTypeRear: "Steering",
  //   axleGroupNumber: 10,
  //   axleGroupSpacing: 3,
  //   interaxleSpreadFront: 1,
  //   interaxleSpreadRear: 4,
  //   numberOfTiresFront: 4,
  //   numberOfTiresRear: 4,
  // };

  const boldTextStyle = {
    fontWeight: "bold",
    width: "300px",
  };
  // const translationPrefix = "vehicle.axle-group";
  // const [numberOfAxleGroups, setNumberOfAxleGroups] = useState(1);
  // const [selectedProvince, setSelectedProvince] = useState<string>("");

  // const [shouldDisplayProvince, setShouldDisplayProvince] =
  //   useState<boolean>(true);

  /**
   *
   */
  const onAddVehicle = function (data: FieldValues) {
    // const formValues =  getValues();
    const powerUnitToBeAdded = data as CreatePowerUnit;
    console.log(data);
    addVehicleQuery.mutate(powerUnitToBeAdded);
    // .then(displaySnackBar(() => {
    //   display: true,
    //   messageI18NKey: "xyz",
    //   isError: false,
    // }));
  };

  /**
   * @returns an array of numbers containing range of years
   */
  function getYears() {
    const endYear = new Date().getFullYear();
    const DIFFERENCE_BETWEEN_START_YEAR_END_YEAR = 20;
    const startYear = endYear - DIFFERENCE_BETWEEN_START_YEAR_END_YEAR;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => endYear - i
    );
  }

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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.unitNumber || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-unit-number-label"
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.unit-number")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-unit-number-label"
                          defaultValue={powerUnit?.unitNumber}
                          {...register("unitNumber", {
                            required: true,
                          })}
                        />
                        {invalid && (
                          <FormHelperText error>
                            Unit Number is required.
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.make || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-make-label"
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.make")}
                        </FormLabel>
                        <Select
                          defaultValue={powerUnit?.make || ""}
                          {...register("make", {
                            required: true,
                          })}
                        >
                          {MAKES.map((make) => (
                            <MenuItem key={`make-${make}`} value={make}>
                              {make}
                            </MenuItem>
                          ))}
                        </Select>
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.year || undefined}
                  render={({ fieldState: { invalid } }) => {
                    return (
                      <>
                        <FormControl margin="normal" error={invalid}>
                          <FormLabel
                            id="power-unit-year-label"
                            sx={boldTextStyle}
                          >
                            {t("vehicle.power-unit.year")}
                          </FormLabel>
                          <Select
                            aria-labelledby="power-unit-year-label"
                            defaultValue={powerUnit?.year || ""}
                            {...register("year", {
                              required: false,
                            })}
                          >
                            {getYears().map((year) => (
                              <MenuItem key={`year-${year}`} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                          </Select>
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
                        <FormLabel id="power-unit-vin-label" sx={boldTextStyle}>
                          {t("vehicle.power-unit.vin")}
                        </FormLabel>
                        <OutlinedInput
                          inputProps={{ maxLength: 17 }}
                          aria-labelledby="power-unit-vin-label"
                          {...register("vin", {
                            required: false,
                            minLength: 17,
                            maxLength: 17,
                          })}
                        />
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.plate || ""}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-plate-label"
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.plate")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-plate-label"
                          // defaultValue={axleGroup?.axleGroupNumber}
                          {...register("plate", {
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
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.power-unit-type")}
                        </FormLabel>
                        <Select
                          aria-labelledby="power-unit-power-unit-type-label"
                          defaultValue={""}
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.licensedGvw || undefined}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-licensed-gvw-label"
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.licensed-gvw")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-licensed-gvw-label"
                          // defaultValue={axleGroup?.axleGroupNumber}
                          {...register("licensedGvw", {
                            required: true,
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
                  rules={{ required: true }}
                  defaultValue={powerUnit?.steerAxleTireSize || undefined}
                  render={({ fieldState: { invalid } }) => (
                    <>
                      <FormControl margin="normal" error={invalid}>
                        <FormLabel
                          id="power-unit-steer-axle-tire-size-label"
                          sx={boldTextStyle}
                        >
                          {t("vehicle.power-unit.steer-axle-tire-size")}
                        </FormLabel>
                        <OutlinedInput
                          aria-labelledby="power-unit-steer-axle-tire-size-label"
                          // defaultValue={axleGroup?.axleGroupNumber}
                          {...register("steerAxleTireSize", {
                            required: false,
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
