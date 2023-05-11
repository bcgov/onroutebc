import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Application } from "../../types/application";
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
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  getDefaultRequiredVal,
  applyWhenNotNullable,
} from "../../../../common/helpers/util";
import { useSaveTermOversizeMutation } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";

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
  const { companyId, userDetails } = useContext(OnRouteBCContext);
  const submitTermOversizeQuery = useSaveTermOversizeMutation();
  const snackBar = useContext(SnackBarContext);

  // Default values to register with React Hook Forms
  // Use saved data from the TROS application context, otherwise use empty or undefined values
  const termOversizeDefaultValues: Application = {
    companyId: +getDefaultRequiredVal(0, companyId),
    applicationNumber: getDefaultRequiredVal(
      "",
      applicationContext?.applicationData?.applicationNumber
    ),
    permitType: getDefaultRequiredVal(
      "TROS",
      applicationContext?.applicationData?.permitType
    ),
    permitStatus: getDefaultRequiredVal(
      "IN_PROGRESS",
      applicationContext?.applicationData?.permitType
    ),
    createdDateTime: getDefaultRequiredVal(
      dayjs(),
      applicationContext?.applicationData?.createdDateTime
    ),
    updatedDateTime: getDefaultRequiredVal(
      dayjs(),
      applicationContext?.applicationData?.updatedDateTime
    ),
    permitData: {
      startDate: getDefaultRequiredVal(
        dayjs(),
        applicationContext?.applicationData?.permitData?.startDate
      ),
      permitDuration: getDefaultRequiredVal(
        30,
        applicationContext?.applicationData?.permitData?.permitDuration
      ),
      expiryDate: getDefaultRequiredVal(
        dayjs(),
        applicationContext?.applicationData?.permitData?.expiryDate
      ),
      commodities: getDefaultRequiredVal(
        [TROS_COMMODITIES[0], TROS_COMMODITIES[1]],
        applicationContext?.applicationData?.permitData?.commodities
      ),
      contactDetails: {
        firstName: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.firstName,
          userDetails?.firstName
        ),
        lastName: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.lastName,
          userDetails?.lastName
        ),
        phone1: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.phone1,
          userDetails?.phone1
        ),
        email: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.email,
          userDetails?.email
        ),
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
        vin: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails?.vin
        ),
        plate: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails?.plate
        ),
        make: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails?.make
        ),
        year: applyWhenNotNullable(
          (year) => year,
          applicationContext?.applicationData?.permitData?.vehicleDetails?.year,
          null
        ),
        countryCode: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails
            ?.countryCode
        ),
        provinceCode: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails
            ?.provinceCode
        ),
        vehicleType: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails
            ?.vehicleType
        ),
        vehicleSubType: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails
            ?.vehicleSubType
        ),
        saveVehicle: getDefaultRequiredVal(
          false,
          applicationContext?.applicationData?.permitData?.vehicleDetails
            ?.saveVehicle
        ),
      },
    },
  };

  const formMethods = useForm<Application>({
    defaultValues: termOversizeDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit, getValues } = formMethods;

  const navigate = useNavigate();

  const onContinue = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as Application;
    termOverSizeToBeAdded.applicationNumber =
      applicationContext.applicationData?.applicationNumber;
    handleSaveVehicle(termOverSizeToBeAdded);
    applicationContext?.setApplicationData(termOverSizeToBeAdded);
    applicationContext?.next();
  };

  const onSaveApplication = async () => {
    const termOverSizeToBeAdded = getValues() as Application;
    termOverSizeToBeAdded.applicationNumber =
      applicationContext.applicationData?.applicationNumber;
    const response = await submitTermOversizeQuery.mutateAsync(
      termOverSizeToBeAdded
    );
    const responseData = await response.data;
    if (response.status === 200) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: `Application ${responseData.applicationNumber} updated.`,
        alertType: "success",
      });
    } else if (response.status === 201) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: `Application ${responseData.applicationNumber} created.`,
        alertType: "success",
      });
    }

    if (response.status === 201 || response.status === 200) {
      applicationContext?.setApplicationData(responseData);
    } else {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: `An unexpected error occured`,
        alertType: "error",
      });
    }
  };

  const addPowerUnitQuery = useAddPowerUnitMutation();
  const updatePowerUnitQuery = useUpdatePowerUnitMutation();
  const addTrailerQuery = useAddTrailerMutation();
  const updateTrailerQuery = useUpdateTrailerMutation();
  const allVehiclesQuery = useVehiclesQuery();

  const handleSaveVehicle = (data: Application) => {
    // Check if the "add/update vehicle" checkbox was checked by the user
    if (!data.permitData.vehicleDetails?.saveVehicle) return;

    // Get the vehicle info from the form
    const vehicle = data.permitData.vehicleDetails;

    // Check if the vehicle that is to be saved was created from an existing vehicle
    const existingVehicle = mapVinToVehicleObject(
      allVehiclesQuery.data,
      vehicle.vin
    );

    // If the vehicle type is a power unit then create a power unit object
    if (vehicle.vehicleType === "powerUnit") {
      let powerUnitId = "";
      let unitNumber = "";
      if (existingVehicle) {
        const powerUnit = existingVehicle as PowerUnit;
        if (powerUnit.powerUnitId) powerUnitId = powerUnit.powerUnitId;
        if (powerUnit.unitNumber) unitNumber = powerUnit.unitNumber;
      }
      const powerUnit: PowerUnit = {
        powerUnitId: powerUnitId,
        unitNumber: unitNumber,
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
      let unitNumber = "";
      if (existingVehicle) {
        const trailer = existingVehicle as Trailer;
        if (trailer.trailerId) trailerId = trailer.trailerId;
        if (trailer.unitNumber) unitNumber = trailer.unitNumber;
      }

      const trailer: Trailer = {
        trailerId: trailerId,
        unitNumber: unitNumber,
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
              onClick={onSaveApplication}
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
