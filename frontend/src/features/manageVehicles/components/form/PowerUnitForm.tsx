import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/button/Button";
import "./VehicleForm.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AxleGroupForm } from "./AxleGroupForm";
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
  powerUnit?: CreatePowerUnit;
  isEditMode?: boolean;
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
  const formMethods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    resetField,
  } = formMethods;

  const queryClient = useQueryClient();

  const powerUnitTypesQuery = useQuery({
    queryKey: ["powerUnitTypes"],
    queryFn: getPowerUnitTypes,
    retry: false,
  });

  const addVehicleQuery = useMutation({
    mutationFn: addPowerUnit,
    onSuccess: data => {
      queryClient.invalidateQueries(["powerUnits"]);
      closeSlidePanel();
      // close slide panel
    }
  })

  function sss() {
    powerUnitTypesQuery.data?.map((powerUnitType: PowerUnitType) => (
      <MenuItem
        key={`powerUnitType-${powerUnitType.typeCode}`}
        value={powerUnitType.typeCode}
      >
        {powerUnitType.type}
      </MenuItem>
    ));
  }

  const countrySelected = watch("country");
  const axleGroupTest = {
    axleFrontGroup: "Single",
    axleTypeFront: "Steering",
    axleTypeRear: "Steering",
    axleGroupNumber: 10,
    axleGroupSpacing: 3,
    interaxleSpreadFront: 1,
    interaxleSpreadRear: 4,
    numberOfTiresFront: 4,
    numberOfTiresRear: 4,
  };

  const boldTextStyle = {
    fontWeight: "bold",
    width: '300px'
  };
  const translationPrefix = "vehicle.axle-group";
  const [numberOfAxleGroups, setNumberOfAxleGroups] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [shouldDisplayProvince, setShouldDisplayProvince] =
    useState<boolean>(true);

  const makes = () => {
    return [];
  };

  /**
   *
   */
  const onAddVehicle = function (data: FieldValues) {
    // const formValues =  getValues();
    const createPowerUnit = data as CreatePowerUnit;
    console.log(data);
    addVehicleQuery.mutate(createPowerUnit);
    // .then(displaySnackBar(() => {
    //   display: true,
    //   messageI18NKey: "xyz",
    //   isError: false,
    // }));
  };

  /**
   *
   * @param powerUnit The powe
   */
  const onEditVehicle = function (powerUnit: UpdatePowerUnit) {
    // const formValues =  getValues();
    console.log(powerUnit);
    // addPowerUnit(formValues).then(displaySnackBar());
  };

  //   const addAxleGroup = function () {
  //     setNumberOfAxleGroups((numberOfAxleGroups) => numberOfAxleGroups + 1);
  //   };
  //   const getAxleGroupForms = function () {
  //     const axleGroupForms = [];
  //     for (let i = 1; i <= numberOfAxleGroups; i++) {
  //       axleGroupForms.push(
  //         <Accordion>
  //           <AccordionSummary
  //             expandIcon={<ExpandMoreIcon />}
  //             aria-controls={`add-axle-group-content-${i}`}
  //             id={`add-axle-group-accordion-summary-${i}`}
  //           >
  //             <span style={boldTextStyle}>{t("vehicle.axle-group")}</span>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //             <AxleGroupForm axleGroup={axleGroupTest} />
  //           </AccordionDetails>
  //         </Accordion>
  //       );
  //     }
  //     return axleGroupForms;
  //   };

  function getProvinceOptions(selectedCountry: string) {
    return CountriesAndStates.filter(
      (country) => country.abbreviation === selectedCountry
    )
      .flatMap((country) => country.states)
      .map((state) => (
        <MenuItem
          key={`state-${state.abbreviation}`}
          value={state.abbreviation}
        >
          {state.name}
        </MenuItem>
      ));
  }

  /**
   * @returns an array of numbers containing range
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
          <AccordionDetails>
            <div id="power-unit-form">
              <div>
                <FormControl margin="normal">
                  <FormLabel
                    id="power-unit-unit-number-label"
                    sx={boldTextStyle}
                  >
                    {t("vehicle.power-unit.unit-number")}
                  </FormLabel>
                  <OutlinedInput
                    aria-labelledby="power-unit-unit-number-label"
                    error={true}
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("unitNumber", {
                      required: true,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-make-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.make")}
                  </FormLabel>
                  <Select
                    defaultValue={""}
                    {...register("make", {
                      required: false,
                    })}
                  >
                    {MAKES.map((make) => (
                      <MenuItem key={`make-${make}`} value={make}>
                        {make}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-year-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.year")}
                  </FormLabel>
                  <Select
                    aria-labelledby="power-unit-year-label"
                    defaultValue={""}
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
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-vin-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.vin")}
                  </FormLabel>
                  <OutlinedInput
                    inputProps={{ maxLength: 17 }}
                    aria-labelledby="power-unit-vin-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("vin", {
                      required: false,
                      minLength: 17,
                      maxLength: 17
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-plate-label" sx={boldTextStyle}>
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
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel
                    id="power-unit-power-unit-type-label"
                    sx={boldTextStyle}
                  >
                    {t("vehicle.power-unit.power-unit-type")}
                  </FormLabel>
                  <Select
                    aria-labelledby="power-unit-power-unit-type-label"
                    defaultValue={""}
                    {...register("powerUnitType", {
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
                  {/* <OutlinedInput
                    aria-labelledby="power-unit-power-unit-type-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("powerUnitType", {
                      required: false,
                    })}
                  /> */}
                </FormControl>
              </div>
              <CountryAndProvince country={""} province={""} />
              {/* <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-country-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.country")}
                  </FormLabel>
                  <Select
                    aria-labelledby="power-unit-country-label"
                    defaultValue={""}
                    {...register("country", {
                      required: false,
                      onChange: (event: SelectChangeEvent) => {
                        console.log(event);
                        const country: string = event.target.value as string;
                        resetField("province", { defaultValue: "" });
                        setSelectedProvince(() => "");
                        
                        if (!COUNTRIES_THAT_SUPPORT_PROVINCE.find(supportedCountry => supportedCountry === country)) {
                          setShouldDisplayProvince(() => false);
                        } else {
                          setShouldDisplayProvince(() => true);
                        }
                      },
                    })}
                    // onChange={() => resetField('province')}
                  >
                    {CountriesAndStates.map((country) => (
                      <MenuItem
                        key={`country-${country.name}`}
                        value={country.abbreviation}
                      >
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {shouldDisplayProvince && (
                <div>
                  <FormControl margin="normal">
                    <FormLabel
                      id="power-unit-province-label"
                      sx={boldTextStyle}
                    >
                      {t("vehicle.power-unit.province")}
                    </FormLabel>
                    <Select
                      aria-labelledby="power-unit-province-label"
                      defaultValue={""}
                      {...register("province", {
                        required: false,
                      })}
                      onChange={(event) =>
                        setSelectedProvince(() => event.target.value as string)
                      }
                      value={selectedProvince}
                    >
                      {getProvinceOptions(countrySelected)}
                    </Select>
                  </FormControl>
                </div>
              )} */}

              <div>
                <FormControl margin="normal">
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
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
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
              </div>
            </div>
            {/* <form className="mv-form">
              <div>
                <label className="mv-label">
                  {t("power-unit.unit-number")}
                </label>
                <input
                  className="mv-input"
                  {...register("unit-number", {
                    required: true,
                  })}
                />
              </div>
              <div>
                <label className="mv-label">{t("power-unit.make")}</label>
                <input className="mv-input" {...register("make")} />
              </div>
              <div>
                <label className="mv-label">{t("power-unit.year")}</label>
                <input
                  className="mv-input"
                  {...register("year", { required: true })}
                />
                {errors.year && (
                  <label className="mv-label">Year is required.</label>
                )}
              </div>
              <div>
                <label className="mv-label">{t("power-unit.vin")}</label>
                <input
                  className="mv-input"
                  {...register("vin", { required: true })}
                />
                {errors.vin && (
                  <label className="mv-label">
                    Please enter number for VIN.
                  </label>
                )}
              </div>
              <div>
                <label className="mv-label">{t("power-unit.plate")}</label>
                <input
                  className="mv-input"
                  {...register("plate", { required: true })}
                />
                {errors.vin && (
                  <label className="mv-label">
                    Please enter number for VIN.
                  </label>
                )}
              </div>
              <div>
                <label className="mv-label">
                  {t("power-unit.power-unit-type")}
                </label>
                <input className="mv-input" {...register("unit-number")} />
              </div>
              <Button
                color={"BC-Gov-PrimaryButton"}
                className={"mt-5"}
                onClick={handleSubmit((data) => console.log(data))}
              >
                Submit
              </Button>
            </form> */}
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
      <div>
        <Button
          color={"BC-Gov-PrimaryButton"}
          key="add-vehicle-button"
          className={"mt-5 add-vehicle-button"}
          onClick={formMethods.handleSubmit(onAddVehicle)}
        >
          {t("vehicle.form.submit")}
        </Button>
      </div>
    </div>
  );
};
