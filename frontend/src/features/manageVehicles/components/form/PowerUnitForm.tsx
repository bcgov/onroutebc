import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import "./VehicleForm.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { AxleGroupForm } from "./AxleGroupForm";
import { CreatePowerUnit } from "../../types/managevehicles";
import { addPowerUnit, getPowerUnitTypes } from "../../apiManager/vehiclesAPI";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { DisplaySnackBarOptions } from "../../../../common/components/snackbar/CustomSnackbar2";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { useState } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

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

  // Used to change the background colour of the accordion summary when expanded
  // Future proof for when more accordions are added, such as axle group
  // https://mui.com/material-ui/react-accordion/#customization
  const powerUnitPanel = "powerunit-panel";
  const [expanded, setExpanded] = useState<string | false>(powerUnitPanel);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      <FormProvider {...formMethods}>
        <Accordion
          expanded={expanded === powerUnitPanel}
          onChange={handleChange(powerUnitPanel)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="add-power-unit-content"
            id="add-power-unit-accordion-summary"
            className="bold-text"
            sx={{
              backgroundColor: expanded
                ? BC_COLOURS.bc_background_light_grey
                : "",
              padding: "0px 28px",
              height: "75px",
            }}
          >
            {t("vehicle.power-unit-details")}
          </AccordionSummary>
          <AccordionDetails
            style={{ padding: `8px 24px ${ADD_VEHICLE_BTN_HEIGHT} 24px ` }}
          >
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
                  rules: { required: true, minLength: 17, maxLength: 17 },
                  label: "VIN",
                  width: formFieldStyle.width,
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
                  label: "Power Unit Type",
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
                  powerUnit?.provinceId
                    ? powerUnit?.provinceId?.split("-")[0]
                    : ""
                }
                province={
                  powerUnit?.provinceId
                    ? powerUnit?.provinceId?.split("-")[1]
                    : ""
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
          </AccordionDetails>
        </Accordion>
        {/* {getAxleGroupForms()} */}
      </FormProvider>
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
