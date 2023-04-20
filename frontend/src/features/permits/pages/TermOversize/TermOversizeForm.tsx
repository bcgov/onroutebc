import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizeApplication } from "../../types/application";
import { ContactDetails } from "../../components/form/ContactDetails";
import { ApplicationDetails } from "../../components/form/ApplicationDetails";
import { VehicleDetails } from "./form/VehicleDetails/VehicleDetails";
import dayjs from "dayjs";
import { useContext } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { PERMIT_LEFT_COLUMN_WIDTH } from "../../../../themes/orbcStyles";
import { ApplicationContext } from "../../context/ApplicationContext";
import { PermitDetails } from "./form/PermitDetails";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { ScrollButton } from "../../components/scrollButton/ScrollButton";
import {
  useAddPowerUnitMutation,
  useUpdatePowerUnitMutation,
  useAddTrailerMutation,
  useUpdateTrailerMutation,
  useVehiclesQuery,
} from "../../../manageVehicles/apiManager/hooks";
import {
  PowerUnit,
  Trailer,
} from "../../../manageVehicles/types/managevehicles";
import { mapVinToVehicleObject } from "../../helpers/mappers";
import { TROS_COMMODITIES } from "../../constants/termOversizeConstants";

/**
 * The first step in creating and submitting a TROS Application.
 * @returns A form for users to create a Term Oversize Application
 */
export const TermOversizeForm = () => {
  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "term-oversize";

  // Styling / responsiveness
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

  // Context to hold all of the application data related to the TROS application
  const applicationContext = useContext(ApplicationContext);

  // Get the logged in users data from session storage
  let userJson;
  const userInfo: any = sessionStorage.getItem("onRoutebc.user.context");
  if (userInfo) userJson = JSON.parse(userInfo);

  // Default values to register with React Hook Forms
  // Use saved data from the TROS application context, otherwise use empty or undefined values
  const termOversizeDefaultValues: TermOversizeApplication = {
    companyId: userJson?.companyId || "",
    //applicationId: applicationContext?.applicationData?.applicationId || 0,
    applicationName:
      applicationContext?.applicationData?.applicationName || "TROS",
    //dateCreated: applicationContext?.applicationData?.dateCreated || dayjs(),
    //lastUpdated: applicationContext?.applicationData?.lastUpdated || dayjs(),
    application: {
      startDate:
        applicationContext?.applicationData?.application?.startDate || dayjs(),
      permitDuration:
        applicationContext?.applicationData?.application?.permitDuration || 30,
      expiryDate:
        applicationContext?.applicationData?.application?.expiryDate || dayjs(),
      commodities: applicationContext?.applicationData?.application
        ?.commodities || [TROS_COMMODITIES[0], TROS_COMMODITIES[1]],
      contactDetails: {
        firstName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.firstName ||
          userJson?.firstName ||
          "",
        lastName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.lastName ||
          userJson?.lastName ||
          "",
        phone1:
          applicationContext?.applicationData?.application?.contactDetails
            ?.phone1 ||
          userJson?.phone1 ||
          "",
        email:
          applicationContext?.applicationData?.application?.contactDetails
            ?.email ||
          userJson?.email ||
          "",
      },
      // Default values are updated from companyInfo query in the ContactDetails common component
      mailingAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        provinceCode: "",
        countryCode: "",
        postalCode: "",
      },
      vehicleDetails: {
        vin:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.vin || "",
        plate:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.plate || "",
        make:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.make || "",
        year:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.year || null,
        countryCode:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.countryCode || "",
        provinceCode:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.provinceCode || "",
        vehicleType:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.vehicleType || "",
        vehicleSubType:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.vehicleSubType || "",
        saveVehicle:
          applicationContext?.applicationData?.application?.vehicleDetails
            ?.saveVehicle || false,
      },
    },
  };

  const formMethods = useForm<TermOversizeApplication>({
    defaultValues: termOversizeDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const navigate = useNavigate();

  const onContinue = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as TermOversizeApplication;
    handleSaveVehicle(termOverSizeToBeAdded);
    applicationContext?.setApplicationData(termOverSizeToBeAdded);
    applicationContext?.next();
  };

  const addPowerUnitQuery = useAddPowerUnitMutation();
  const updatePowerUnitQuery = useUpdatePowerUnitMutation();
  const addTrailerQuery = useAddTrailerMutation();
  const updateTrailerQuery = useUpdateTrailerMutation();
  const allVehiclesQuery = useVehiclesQuery();

  const handleSaveVehicle = (data: TermOversizeApplication) => {
    // Check if the "add/update vehicle" checkbox was checked by the user
    if (!data.application.vehicleDetails?.saveVehicle) return;

    // Get the vehicle info from the form
    const vehicle = data.application.vehicleDetails;

    // Check if the vehicle that is to be saved was created from an existing vehicle
    const existingVehicle = mapVinToVehicleObject(
      allVehiclesQuery.data,
      vehicle.vin
    );

    // If the vehicle type is a power unit then create a power unit object
    if (vehicle.vehicleType === "powerUnit") {
      let powerUnitId = "";
      if (existingVehicle) {
        const powerUnit = existingVehicle as PowerUnit;
        if (powerUnit.powerUnitId) {
          powerUnitId = powerUnit.powerUnitId;
        }
      }
      const powerUnit: PowerUnit = {
        powerUnitId: powerUnitId,
        unitNumber: "",
        vin: vehicle.vin,
        plate: vehicle.plate,
        make: vehicle.make,
        year: vehicle.year,
        countryCode: vehicle.countryCode,
        provinceCode: vehicle.provinceCode,
        powerUnitTypeCode: vehicle.vehicleSubType,
      };

      // Either send a PUT or POST request based on powerUnitID
      if (powerUnitId) {
        updatePowerUnitQuery.mutate({
          powerUnit: powerUnit,
          powerUnitId: powerUnitId,
        });
      } else {
        addPowerUnitQuery.mutate(powerUnit);
      }
    }

    if (vehicle.vehicleType === "trailer") {
      let trailerId = "";
      if (existingVehicle) {
        const trailer = existingVehicle as Trailer;
        if (trailer.trailerId) {
          trailerId = trailer.trailerId;
        }
      }

      const trailer: Trailer = {
        trailerId: trailerId,
        unitNumber: "",
        vin: vehicle.vin,
        plate: vehicle.plate,
        make: vehicle.make,
        year: vehicle.year,
        countryCode: vehicle.countryCode,
        provinceCode: vehicle.provinceCode,
        trailerTypeCode: vehicle.vehicleSubType,
      };

      if (trailerId) {
        updateTrailerQuery.mutate({ trailer: trailer, trailerId: trailerId });
      } else {
        addTrailerQuery.mutate(trailer);
      }
    }
  };

  /**
   * Changed view to the main Vehicle Inventory page
   */
  const handleClose = () => {
    navigate("../");
  };

  return (
    <>
      <ProgressBar />
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Box sx={{ paddingBottom: "80px" }}>
          <FormProvider {...formMethods}>
            <ApplicationDetails values={termOversizeDefaultValues} />
            <ContactDetails feature={FEATURE} />
            <PermitDetails feature={FEATURE} />
            <VehicleDetails feature={FEATURE} />
          </FormProvider>
        </Box>

        <Box
          sx={{
            position: "fixed",
            height: "100px",
            top: "calc(100vh - 100px)",
            backgroundColor: BC_COLOURS.white,
            width: "100vw",
            display: "flex",
            alignItems: "center",
            marginLeft: "-60px",
            marginRight: matches ? "80px" : "60px",
            paddingRight: "30px",
            justifyContent: "space-between",
            borderTop: `1px solid ${BC_COLOURS.bc_text_box_border_grey}`,
          }}
        >
          <Button
            key="leave-application-button"
            aria-label="leave"
            variant="contained"
            color="secondary"
            onClick={handleClose}
            sx={{
              marginLeft: matches
                ? "20px"
                : `calc(${PERMIT_LEFT_COLUMN_WIDTH} + 60px)`,
            }}
          >
            Leave Application
          </Button>
          <Box>
            <Button
              key="save-TROS-button"
              aria-label="save"
              variant="contained"
              color="secondary"
              sx={{ marginLeft: "-420px" }}
            >
              Save Application
            </Button>
            <Button
              key="submit-TROS-button"
              aria-label="Submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onContinue)}
              sx={{ marginLeft: "20px" }}
            >
              Continue
            </Button>
            <ScrollButton />
          </Box>
        </Box>
      </Box>
    </>
  );
};
