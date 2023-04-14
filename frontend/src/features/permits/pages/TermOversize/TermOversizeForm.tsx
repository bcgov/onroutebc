import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizeApplication } from "../../types/application";
import { ContactDetails } from "../../components/form/ContactDetails";
import { ApplicationDetails } from "../../components/form/ApplicationDetails";
import { VehicleDetails } from "./form/VehicleDetails";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { PERMIT_LEFT_COLUMN_WIDTH } from "../../../../themes/orbcStyles";
import { ApplicationContext } from "../../context/ApplicationContext";
import { TROSCommodities } from "./form/ConditionsTable";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { PermitDetails } from "./form/PermitDetails";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { ScrollButton } from "../../components/scrollButton/ScrollButton";
import {
  useAddPowerUnitMutation,
  useAddTrailerMutation,
  useUpdatePowerUnitMutation,
  useUpdateTrailerMutation,
  useVehiclesQuery,
} from "../../../manageVehicles/apiManager/hooks";
import {
  PowerUnit,
  Trailer,
} from "../../../manageVehicles/types/managevehicles";

/**
 * The first step in creating and submitting a TROS Application.
 * @returns A form for users to create a Term Oversize Application
 */
export const TermOversizeForm = () => {
  const applicationContext = useContext(ApplicationContext);
  const companyInfoQuery = useCompanyInfoQuery();
  const addPowerUnitQuery = useAddPowerUnitMutation();
  const updatePowerUnitQuery = useUpdatePowerUnitMutation();
  const addTrailerQuery = useAddTrailerMutation();
  const updateTrailerQuery = useUpdateTrailerMutation();
  const allVehiclesQuery = useVehiclesQuery();

  // TODO Clean this up
  const userInfo: any = sessionStorage.getItem("onRoutebc.user.context");
  const userJson = JSON.parse(userInfo);

  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const termOversizeDefaultValues: TermOversizeApplication = {
    applicationId:
      applicationContext?.applicationData?.applicationId || 1234567,
    applicationName:
      applicationContext?.applicationData?.applicationName || "Oversize: Term",
    dateCreated: applicationContext?.applicationData?.dateCreated || dayjs(),
    lastUpdated: applicationContext?.applicationData?.lastUpdated || dayjs(),
    application: {
      startDate:
        applicationContext?.applicationData?.application?.startDate || dayjs(),
      permitDuration:
        applicationContext?.applicationData?.application?.permitDuration || 30,
      expiryDate:
        applicationContext?.applicationData?.application?.expiryDate || dayjs(),
      commodities: applicationContext?.applicationData?.application
        ?.commodities || [TROSCommodities[0], TROSCommodities[1]],
      contactDetails: {
        firstName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.firstName ||
          userJson.firstName ||
          "",
        lastName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.lastName ||
          userJson.lastName ||
          "",
        phone1:
          applicationContext?.applicationData?.application?.contactDetails
            ?.phone1 ||
          userJson.phone1 ||
          "",
        email:
          applicationContext?.applicationData?.application?.contactDetails
            ?.email ||
          userJson.email ||
          "",
      },
      mailingAddress: {
        addressLine1:
          companyInfoQuery?.data?.companyAddress?.addressLine1 || "",
        addressLine2:
          companyInfoQuery?.data?.companyAddress?.addressLine2 || "",
        city: companyInfoQuery?.data?.companyAddress?.city || "",
        provinceCode:
          companyInfoQuery?.data?.companyAddress?.provinceCode || "",
        countryCode: companyInfoQuery?.data?.companyAddress?.countryCode || "",
        postalCode: companyInfoQuery?.data?.companyAddress?.postalCode || "",
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

  const { handleSubmit, setValue } = formMethods;

  /**
   * UseEffect to get company mailing address and primary contact, since companyInfo query is async
   */
  useEffect(() => {
    setValue("application.mailingAddress", {
      addressLine1: companyInfoQuery?.data?.companyAddress?.addressLine1 || "",
      addressLine2: companyInfoQuery?.data?.companyAddress?.addressLine2 || "",
      city: companyInfoQuery?.data?.companyAddress?.city || "",
      provinceCode: companyInfoQuery?.data?.companyAddress?.provinceCode || "",
      countryCode: companyInfoQuery?.data?.companyAddress?.countryCode || "",
      postalCode: companyInfoQuery?.data?.companyAddress?.postalCode || "",
    });

    // setValue("application.contactDetails", {
    //   firstName: companyInfoQuery?.data?.primaryContact?.firstName || "",
    //   lastName: companyInfoQuery?.data?.primaryContact?.lastName || "",
    //   phone1: companyInfoQuery?.data?.primaryContact?.phone1 || "",
    //   email: companyInfoQuery?.data?.primaryContact?.email || "",
    // });
  }, [companyInfoQuery]);

  const navigate = useNavigate();

  const onContinue = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as TermOversizeApplication;
    handleSaveVehicle(termOverSizeToBeAdded);
    applicationContext?.setApplicationData(termOverSizeToBeAdded);
    applicationContext?.next();
  };

  const handleSaveVehicle = (data: TermOversizeApplication) => {
    if (!data.application.vehicleDetails?.saveVehicle) return;

    const vehicle = data.application.vehicleDetails;

    const existingVehicle: (PowerUnit | Trailer)[] | undefined =
      allVehiclesQuery.data?.filter((item) => {
        return item.vin === vehicle.vin;
      });

    if (data.application.vehicleDetails.vehicleType === "powerUnit") {
      let powerUnitId = "";
      if (existingVehicle && existingVehicle[0]) {
        const powerUnit = existingVehicle[0] as PowerUnit;
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

      if (powerUnitId) {
        updatePowerUnitQuery.mutate(powerUnit);
      } else {
        addPowerUnitQuery.mutate(powerUnit);
      }
    }

    if (data.application.vehicleDetails.vehicleType === "trailer") {
      let trailerId = "";
      if (existingVehicle && existingVehicle[0]) {
        const trailer = existingVehicle[0] as Trailer;
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
        updateTrailerQuery.mutate(trailer);
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

  /**
   * The name of this feature that is used for id's, keys, and associating form components
   */
  const FEATURE = "term-oversize";

  /**
   * The following code is used to style the bottom banner that has the
   * Leave Application, Save App, Continue, and To Top buttons
   *
   * Need to clean up this up
   */
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

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
