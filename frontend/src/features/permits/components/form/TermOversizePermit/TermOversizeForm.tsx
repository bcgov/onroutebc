import { useForm, FormProvider, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizePermit } from "../../../types/permits";
import { useSubmitTermOversizeMutation } from "../../../apiManager/hooks";
import { ContactDetails } from "../ContactDetails";
import { ApplicationDetails } from "../ApplicationDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "../VehicleDetails";
import dayjs from "dayjs";
import { useCompanyInfoQuery } from "../../../../manageProfile/apiManager/hooks";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { useEffect, useState } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { PERMIT_LEFT_COLUMN_WIDTH } from "../../../../../themes/orbcStyles";

export const TermOversizeForm = ({
  termOversizePermit,
}: {
  termOversizePermit?: TermOversizePermit;
}) => {
  const submitTermOversizeQuery = useSubmitTermOversizeMutation();
  const contactDetails = useCompanyInfoQuery();

  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const termOversizeDefaultValues: TermOversizePermit = {
    applicationId: termOversizePermit?.applicationId || 1234567,
    dateCreated: termOversizePermit?.dateCreated || dayjs(),
    lastUpdated: termOversizePermit?.lastUpdated || dayjs(),
    permitDetails: {
      startDate: termOversizePermit?.permitDetails?.startDate || dayjs(),
      endDate: termOversizePermit?.permitDetails?.endDate || "",
      permitDuration: termOversizePermit?.permitDetails?.permitDuration || 30,
      commodities: termOversizePermit?.permitDetails?.commodities || [],
    },
  };

  const formMethods = useForm<TermOversizePermit>({
    defaultValues: termOversizeDefaultValues,
    reValidateMode: "onBlur",
  });

  /**
   * Set default values for Contact Details
   * If the user has entered a value, use that value
   * Else, use the value from the CompanyInfo query
   */
  useEffect(() => {
    if (contactDetails) {
      formMethods.setValue("contactDetails.primaryContact", {
        firstName:
          formMethods.getValues("contactDetails.primaryContact.firstName") ||
          contactDetails?.data?.primaryContact.firstName ||
          "",
        lastName:
          formMethods.getValues("contactDetails.primaryContact.lastName") ||
          contactDetails?.data?.primaryContact.lastName ||
          "",
        phone1:
          formatPhoneNumber(
            formMethods.getValues("contactDetails.primaryContact.phone1")
          ) ||
          formatPhoneNumber(contactDetails?.data?.primaryContact?.phone1) ||
          "",
        phone1Extension:
          formMethods.getValues(
            "contactDetails.primaryContact.phone1Extension"
          ) ||
          contactDetails?.data?.primaryContact?.phone1Extension ||
          "",
        phone2:
          formatPhoneNumber(
            formMethods.getValues("contactDetails.primaryContact.phone2")
          ) ||
          formatPhoneNumber(contactDetails?.data?.primaryContact?.phone2) ||
          "",
        phone2Extension:
          formMethods.getValues(
            "contactDetails.primaryContact.phone2Extension"
          ) ||
          contactDetails?.data?.primaryContact?.phone2Extension ||
          "",
        email:
          formMethods.getValues("contactDetails.primaryContact.email") ||
          contactDetails?.data?.primaryContact?.email ||
          "",
        city:
          formMethods.getValues("contactDetails.primaryContact.city") ||
          contactDetails?.data?.primaryContact?.city ||
          "",
        provinceCode:
          formMethods.getValues("contactDetails.primaryContact.provinceCode") ||
          contactDetails?.data?.primaryContact?.provinceCode ||
          "",
        countryCode:
          formMethods.getValues("contactDetails.primaryContact.countryCode") ||
          contactDetails?.data?.primaryContact?.countryCode ||
          "",
      });
    }
  }, [contactDetails]);

  const { handleSubmit } = formMethods;

  const navigate = useNavigate();

  const onSubmitTermOversize = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as TermOversizePermit;
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
   * The following code is used to setyle the bottom ba that has the
   * Leave Application, Save App, Continue, and To Top buttons
   *
   * Need to clean up this up
   */
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const listenToScroll = () => {
    const heightToHideFrom = 600;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      !isVisible && // to limit setting state only the first time
        setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <>
      <Box sx={{ paddingBottom: "80px" }}>
        <Typography
          variant={"h2"}
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
          marginLeft: matches ? "-20px" : "-60px",
          justifyContent: "space-between",
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
            onClick={handleSubmit(onSubmitTermOversize)}
            sx={{ marginLeft: "20px" }}
          >
            Continue
          </Button>
          {isVisible && (
            <Button
              key="to-top-button"
              aria-label="To Top"
              variant="contained"
              color="secondary"
              onClick={scrollToTop}
              sx={{
                position: "fixed",
                bottom: 120,
                right: matches ? 20 : 60,
                width: "20px",
              }}
            >
              <i
                className="fa fa-chevron-up"
                style={{ marginLeft: "8px", marginRight: "8px" }}
              ></i>
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};
