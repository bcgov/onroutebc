import { useForm, FormProvider, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizeApplication } from "../../../types/application";
import { useSubmitTermOversizeMutation } from "../../../apiManager/hooks";
import { ContactDetails } from "../ContactDetails";
import { ApplicationDetails } from "../ApplicationDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "../VehicleDetails";
import dayjs from "dayjs";
import { useContext } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { PERMIT_LEFT_COLUMN_WIDTH } from "../../../../../themes/orbcStyles";
import { ApplicationContext } from "../../../context/ApplicationContext";

export const TermOversizeForm = () => {
  const applicationContext = useContext(ApplicationContext);
  const submitTermOversizeQuery = useSubmitTermOversizeMutation();

  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const termOversizeDefaultValues: TermOversizeApplication = {
    applicationId:
      applicationContext?.applicationData?.applicationId || 1234567,
    dateCreated: applicationContext?.applicationData?.dateCreated || dayjs(),
    lastUpdated: applicationContext?.applicationData?.lastUpdated || dayjs(),
    application: {
      startDate:
        applicationContext?.applicationData?.application?.startDate || dayjs(),
      permitDuration:
        applicationContext?.applicationData?.application?.permitDuration || 30,
      expiryDate:
        applicationContext?.applicationData?.application?.expiryDate || dayjs(),
      commodities:
        applicationContext?.applicationData?.application?.commodities || [],
      contactDetails: {
        firstName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.firstName || "",
        lastName:
          applicationContext?.applicationData?.application?.contactDetails
            ?.lastName || "",
        phone1:
          applicationContext?.applicationData?.application?.contactDetails
            ?.phone1 || "",
        email:
          applicationContext?.applicationData?.application?.contactDetails
            ?.email || "",
        city:
          applicationContext?.applicationData?.application?.contactDetails
            ?.city || "",
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
            ?.year || "",
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
    applicationContext?.setApplicationData(termOverSizeToBeAdded);
    applicationContext?.next();
    //submitTermOversizeQuery.mutate(termOverSizeToBeAdded);
  };

  const onSubmitTermOversize = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as TermOversizeApplication;
    submitTermOversizeQuery.mutate(termOverSizeToBeAdded);
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

  const handleNavigateBack = () => {
    navigate("../");
  };

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          display: "flex",
          height: "60px",
          alignItems: "center",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          onClick={handleNavigateBack}
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
        >
          Permits
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography>Permit Application</Typography>
      </Box>
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Box sx={{ paddingBottom: "80px" }}>
          <Typography
            variant={"h1"}
            sx={{
              marginRight: "200px",
              marginTop: "0px",
              paddingTop: "0px",
              borderBottom: "none",
            }}
          >
            Oversize: Term
          </Typography>
          <FormProvider {...formMethods}>
            <ApplicationDetails />
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
          </Box>
        </Box>
      </Box>
    </>
  );
};
