import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Application } from "../../types/application";
import { ContactDetails } from "../../components/form/ContactDetails";
import { ApplicationDetails } from "../../components/form/ApplicationDetails";
import { VehicleDetails } from "./form/VehicleDetails/VehicleDetails";
import dayjs from "dayjs";
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
import { getUserGuidFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { LeaveApplicationDialog } from "../../components/dialog/LeaveApplicationDialog";
import { areApplicationDataEqual } from "../../helpers/equality";


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

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] = useState<boolean>(false); 

  // Default values to register with React Hook Forms
  // Use saved data from the TROS application context, otherwise use empty or undefined values
  const termOversizeDefaultValues: Application = {
    companyId: +getDefaultRequiredVal(0, companyId),
    applicationNumber: getDefaultRequiredVal(
      "",
      applicationContext?.applicationData?.applicationNumber
    ),
    userGuid: getUserGuidFromSession(),
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
        phone1Extension: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.phone1Extension
        ),
        phone2: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.phone2
        ),
        phone2Extension: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.phone2Extension
        ),
        email: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.email,
          userDetails?.email
        ),
        fax: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.contactDetails
            ?.fax
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
        unitNumber: getDefaultRequiredVal(
          "",
          applicationContext?.applicationData?.permitData?.vehicleDetails?.unitNumber
        ),
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

  const applicationFormData = (data: FieldValues) => {
    return {
      ...data,
      applicationNumber: applicationContext.applicationData?.applicationNumber,
    } as Application;
  };

  const isApplicationSaved = () => {
    const currentFormData = applicationFormData(getValues());
    const savedData = applicationContext.applicationData;
    if (!savedData) return false;

    // Check if all current form field values match field values saved in application context
    return areApplicationDataEqual(currentFormData.permitData, savedData.permitData);
  };

  const onContinue = function (data: FieldValues) {
    const termOverSizeToBeAdded = applicationFormData(data);
    handleSaveVehicle(termOverSizeToBeAdded);
    applicationContext?.setApplicationData(termOverSizeToBeAdded);
    applicationContext?.next();
  };

  const isSubmitTermOversizeSuccessful = (status: number) => status === 200 || status === 201;

  const onSubmitSuccess = (responseData: Application, status: number) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Application ${responseData.applicationNumber} ${status === 201 ? "created" : "updated"}.`,
      alertType: "success",
    });

    applicationContext?.setApplicationData(responseData);
  };

  const onSubmitFailure = () => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `An unexpected error occured`,
      alertType: "error",
    });
  };

  const onSaveApplication = async () => {
    const termOverSizeToBeAdded = applicationFormData(getValues());
    const response = await submitTermOversizeQuery.mutateAsync(
      termOverSizeToBeAdded
    );
    
    if (isSubmitTermOversizeSuccessful(response.status)) {
      const responseData = await response.data;
      onSubmitSuccess(responseData as Application, response.status);
    } else {
      onSubmitFailure();
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
            <ApplicationDetails values={termOversizeDefaultValues} />
            <ContactDetails feature={FEATURE} values={termOversizeDefaultValues} />
            <PermitDetails feature={FEATURE}  values={termOversizeDefaultValues}/>
            <VehicleDetails feature={FEATURE} values={termOversizeDefaultValues}/>
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
            //onClick={handleLeaveApplication}
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
              color="secondary"
              sx={{ marginLeft: "-420px", marginTop: "40px", display: "flex", alignItems: "center", gap: "10px"}}
              onClick={onSaveApplication}
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
