import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/button/Button";
import "./VehicleForm.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AxleGroupForm } from "./AxleGroupForm";
import { useState } from "react";
import { CreatePowerUnit, AxleFrontGroup, AxleGroup, AxleType } from "../../types";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { addPowerUnit, updatePowerUnit } from "../../hooks/useVehiclesApi";

interface PowerUnitFormProps {
  displaySnackBar?: React.Dispatch<React.SetStateAction<boolean>>;
  powerUnit?: CreatePowerUnit;
}

/**
 *
 * @returns
 */
export const PowerUnitForm = ({
  displaySnackBar,
  powerUnit,
}: PowerUnitFormProps) => {
  const formMethods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = formMethods;

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
  };
  const translationPrefix = "vehicle.axle-group";
  const [numberOfAxleGroups, setNumberOfAxleGroups] = useState(1);

  /**
   *
   */
  const onAddVehicle = function (data) {
    // const formValues =  getValues();
    console.log(data);
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
                  <OutlinedInput
                    aria-labelledby="power-unit-make-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("make", {
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-year-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.year")}
                  </FormLabel>
                  <OutlinedInput
                    aria-labelledby="power-unit-year-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("year", {
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-vin-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.vin")}
                  </FormLabel>
                  <OutlinedInput
                    aria-labelledby="power-unit-vin-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("vin", {
                      required: false,
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
                  <OutlinedInput
                    aria-labelledby="power-unit-power-unit-type-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("powerUnitType", {
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-country-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.country")}
                  </FormLabel>
                  <OutlinedInput
                    aria-labelledby="power-unit-country-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("country", {
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl margin="normal">
                  <FormLabel id="power-unit-province-label" sx={boldTextStyle}>
                    {t("vehicle.power-unit.province")}
                  </FormLabel>
                  <OutlinedInput
                    aria-labelledby="power-unit-province-label"
                    // defaultValue={axleGroup?.axleGroupNumber}
                    {...register("province", {
                      required: false,
                    })}
                  />
                </FormControl>
              </div>
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