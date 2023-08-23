import { FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Application, VehicleDetails as VehicleDetailsType } from "../../types/application";
import { ContactDetails } from "../../components/form/ContactDetails";
import { ApplicationDetails } from "../../components/form/ApplicationDetails";
import { VehicleDetails } from "./form/VehicleDetails/VehicleDetails";
import { useContext, useState } from "react";
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
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
} from "../../../manageVehicles/apiManager/hooks";
import {
  PowerUnit,
  Trailer,
} from "../../../manageVehicles/types/managevehicles";
import { mapVinToVehicleObject } from "../../helpers/mappers";
import { useSaveTermOversizeMutation } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { LeaveApplicationDialog } from "../../components/dialog/LeaveApplicationDialog";
import { areApplicationDataEqual } from "../../helpers/equality";
import { useDefaultApplicationFormData } from "../../hooks/useDefaultApplicationFormData";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";

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

  // Use a custom hook that performs the following whenever page is rendered (or when application context is updated/changed):
  // 1. Get all data needed to generate default values for the application form (from application context, company, user details)
  // 2. Generate those default values and register them to the form
  // 3. Listens for changes to application context (which happens when application is fetched/submitted/updated)
  // 4. Updates form default values when application context data values change
  const { 
    defaultApplicationDataValues: termOversizeDefaultValues,
    formMethods,
  } = useDefaultApplicationFormData(
    applicationContext?.applicationData
  );

  const submitTermOversizeMutation = useSaveTermOversizeMutation();
  const snackBar = useContext(SnackBarContext);
  const { companyLegalName, onRouteBCClientNumber } = useContext(OnRouteBCContext);

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] = useState<boolean>(false); 

  const { handleSubmit, getValues } = formMethods;

  const navigate = useNavigate();

  // Helper method to return form field values as an Application object
  const applicationFormData = (data: FieldValues) => {
    return {
      ...data,
      applicationNumber: applicationContext.applicationData?.applicationNumber,
      permitData: {
        ...data.permitData,
        companyName: companyLegalName,
        clientNumber: onRouteBCClientNumber,
        vehicleDetails: {
          ...data.permitData.vehicleDetails,
          // Convert year to number here, as React doesn't accept valueAsNumber prop for input component
          year: !isNaN(Number(data.permitData.vehicleDetails.year)) ? 
            Number(data.permitData.vehicleDetails.year) : data.permitData.vehicleDetails.year
        }
      }
    } as Application;
  };

  // Check to see if all application values were already saved
  const isApplicationSaved = () => {
    const currentFormData = applicationFormData(getValues());
    const savedData = applicationContext.applicationData;
    if (!savedData) return false;

    // Check if all current form field values match field values already saved in application context
    return areApplicationDataEqual(currentFormData.permitData, savedData.permitData);
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const termOverSizeToBeAdded = applicationFormData(data);
    const vehicleData = termOverSizeToBeAdded.permitData.vehicleDetails;
    handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication(() => applicationContext?.next());
  };

  const isSaveTermOversizeSuccessful = (status: number) => status === 200 || status === 201;

  const onSaveSuccess = (responseData: Application, status: number) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Application ${responseData.applicationNumber} ${status === 201 ? "created" : "updated"}.`,
      alertType: "success",
    });

    applicationContext?.setApplicationData(responseData);
  };

  const onSaveFailure = () => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `An unexpected error occured`,
      alertType: "error",
    });
  };

  // Whenever application is to be saved (either through "Save" or "Continue")
  const onSaveApplication = async (additionalSuccessAction?: () => void) => {
    const termOverSizeToBeAdded = applicationFormData(getValues());
    const response = await submitTermOversizeMutation.mutateAsync(
      termOverSizeToBeAdded
    );
    
    if (isSaveTermOversizeSuccessful(response.status)) {
      const responseData = response.data;
      onSaveSuccess(responseData as Application, response.status);
      additionalSuccessAction?.();
    } else {
      onSaveFailure();
    }
  };

  // Mutations used to add/update vehicle details
  const addPowerUnitMutation = useAddPowerUnitMutation();
  const updatePowerUnitMutation = useUpdatePowerUnitMutation();
  const addTrailerMutation = useAddTrailerMutation();
  const updateTrailerMutation = useUpdateTrailerMutation();

  // Queries used to populate select options for vehicle details
  const allVehiclesQuery = useVehiclesQuery();
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();

  // Vehicle details that have been fetched by vehicle details queries
  const fetchedVehicles = getDefaultRequiredVal([], allVehiclesQuery.data);
  const fetchedPowerUnitTypes = getDefaultRequiredVal([], powerUnitTypesQuery.data);
  const fetchedTrailerTypes = getDefaultRequiredVal([], trailerTypesQuery.data);

  const handleSaveVehicle = (vehicleData?: VehicleDetailsType) => {
    // Check if the "add/update vehicle" checkbox was checked by the user
    if (!vehicleData?.saveVehicle) return;

    // Get the vehicle info from the form
    const vehicle = vehicleData;

    // Check if the vehicle that is to be saved was created from an existing vehicle
    const existingVehicle = mapVinToVehicleObject(
      fetchedVehicles,
      vehicle.vin
    );

    const transformByVehicleType = (vehicleFormData: VehicleDetailsType, existingVehicle?: PowerUnit | Trailer): PowerUnit | Trailer => {
      const defaultPowerUnit: PowerUnit = {
        powerUnitId: "",
        unitNumber: "",
        vin: vehicleFormData.vin,
        plate: vehicleFormData.plate,
        make: vehicleFormData.make,
        year: vehicleFormData.year,
        countryCode: vehicleFormData.countryCode,
        provinceCode: vehicleFormData.provinceCode,
        powerUnitTypeCode: vehicleFormData.vehicleSubType,
      };

      const defaultTrailer: Trailer = {
        trailerId: "",
        unitNumber: "",
        vin: vehicleFormData.vin,
        plate: vehicleFormData.plate,
        make: vehicleFormData.make,
        year: vehicleFormData.year,
        countryCode: vehicleFormData.countryCode,
        provinceCode: vehicleFormData.provinceCode,
        trailerTypeCode: vehicleFormData.vehicleSubType,
      };

      switch (vehicleFormData.vehicleType) {
        case "trailer":
          return {
            ...defaultTrailer,
            trailerId: getDefaultRequiredVal("", (existingVehicle as Trailer)?.trailerId),
            unitNumber: getDefaultRequiredVal("", existingVehicle?.unitNumber),
          } as Trailer;
        case "powerUnit":
        default:
          return {
            ...defaultPowerUnit,
            unitNumber: getDefaultRequiredVal("", existingVehicle?.unitNumber),
            powerUnitId: getDefaultRequiredVal("", (existingVehicle as PowerUnit)?.powerUnitId),
          } as PowerUnit;
      }
    };

    // If the vehicle type is a power unit then create a power unit object
    if (vehicle.vehicleType === "powerUnit") {
      const powerUnit = transformByVehicleType(vehicle, existingVehicle) as PowerUnit;

      // Either send a PUT or POST request based on powerUnitID
      if (powerUnit.powerUnitId) {
        updatePowerUnitMutation.mutate({
          powerUnit,
          powerUnitId: powerUnit.powerUnitId,
        });
      } else {
        addPowerUnitMutation.mutate(powerUnit);
      }
    } else if (vehicle.vehicleType === "trailer") {
      const trailer = transformByVehicleType(vehicle, existingVehicle) as Trailer;
      
      if (trailer.trailerId) {
        updateTrailerMutation.mutate({ trailer, trailerId: trailer.trailerId });
      } else {
        addTrailerMutation.mutate(trailer);
      }
    }
  };

  // Whenever "Leave" button is clicked
  const handleLeaveApplication = () => {
    if (!isApplicationSaved()) {
      setShowLeaveApplicationDialog(true);
    } else {
      navigate("../applications");
    }
  };

  const handleLeaveUnsaved = () => {
    navigate("../applications");
  };

  const handleStayOnApplication = () => {
    setShowLeaveApplicationDialog(false);
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
            <ApplicationDetails
              permitType={termOversizeDefaultValues.permitType}
              applicationNumber={termOversizeDefaultValues.applicationNumber}
              createdDateTime={termOversizeDefaultValues.createdDateTime}
              updatedDateTime={termOversizeDefaultValues.updatedDateTime}
            />
            <ContactDetails feature={FEATURE} />
            <PermitDetails 
              feature={FEATURE}
              defaultStartDate={termOversizeDefaultValues.permitData.startDate}
              defaultDuration={termOversizeDefaultValues.permitData.permitDuration}
              commodities={termOversizeDefaultValues.permitData.commodities}
              applicationNumber={termOversizeDefaultValues.applicationNumber}
            />
            <VehicleDetails
              feature={FEATURE}
              vehicleData={termOversizeDefaultValues.permitData.vehicleDetails}
              vehicleOptions={fetchedVehicles}
              powerUnitTypes={fetchedPowerUnitTypes}
              trailerTypes={fetchedTrailerTypes}
            />
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
            onClick={handleLeaveApplication}
            data-testid="leave-application-button"
            sx={{
              marginLeft: matches
                ? "20px"
                : `calc(${PERMIT_LEFT_COLUMN_WIDTH} + 60px)`,
            }}
          >
            Leave
          </Button>
          <Box>
            <Button
              key="save-TROS-button"
              aria-label="save"
              variant="contained"
              color="tertiary"
              sx={{ marginLeft: "-420px", marginTop: "40px", display: "flex", alignItems: "center", gap: "10px"}}
              onClick={() => onSaveApplication()}
              data-testid="save-application-button"
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </Button>
            <Button
              key="submit-TROS-button"
              aria-label="Submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onContinue)}
              sx={{ marginLeft: "-260px", marginTop: "-72px" }}
              data-testid="continue-application-button"
            >
              Continue
            </Button>
            <ScrollButton />
          </Box>
        </Box>
      </Box>
      <LeaveApplicationDialog
        onLeaveUnsaved={handleLeaveUnsaved}
        onContinueEditing={handleStayOnApplication}
        showDialog={showLeaveApplicationDialog}
      />
    </>
  );
};
