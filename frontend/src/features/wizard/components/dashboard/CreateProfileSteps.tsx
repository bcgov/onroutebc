import {
  Alert,
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useAuth } from "react-oidc-context";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./CreateProfileSteps.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import "../../../../common/components/dashboard/Dashboard.scss";
import { createOnRouteBCProfile } from "../../../manageProfile/apiManager/manageProfileAPI";
import { UserInformationWizardForm } from "../../pages/UserInformationWizardForm";
import { CompanyInformationWizardForm } from "../../pages/CompanyInformationWizardForm";
import { OnRouteBCProfileCreated } from "../../pages/OnRouteBCProfileCreated";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { CompanyAndUserRequest } from "../../../manageProfile/types/manageProfile";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { SnackBarContext } from "../../../../App";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

const CompanyBanner = ({ legalName }: { legalName: string }) => {
  return (
    <Box
      sx={{
        height: 100,
        backgroundColor: BC_COLOURS.banner_grey,
        color: BC_COLOURS.bc_primary_blue,
        marginTop: "20px",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Typography variant="h5">COMPANY NAME</Typography>
        <Typography variant="h4">{legalName}</Typography>
      </div>
    </Box>
  );
};

const ExistingTPSSelection = ({ screenSize }: { screenSize: "lg" | "sm" }) => (
  <div className={`existing-tps-action existing-tps-action--${screenSize}`}>
    <div className="existing-tps-action__img-wrapper">
      <img
        height="54"
        width="54"
        src="./Existing_Account_Graphic.svg"
        alt="TPS Profile"
      />
    </div>
    <div className="existing-tps-action__profile">
      <strong>Already have a TPS profile?</strong>
      <Button variant="outlined" color="info" size="small">
        Claim it now
      </Button>
    </div>
  </div>
);

/**
 * Gets the section name inside the form for a particular field name
 * @param field - Field name inside the form (eg. primaryContact.firstName)
 * @returns Name of the section in the form that the field belongs to (eg. Company Primary Contact)
 */
const getSectionNameByField = (field: string) => {
  const sectionParts = field.split(".");

  switch (sectionParts[0]) {
    case "mailingAddress":
      return "Company Mailing Address";
    case "primaryContact":
      return "Company Primary Contact";
    case "adminUser":
      return "User Details";
    default:
      return "Company Contact Details";
  }
};

const isSubmissionSuccessful = (status: number) => status === 201 || status === 200;
const hasValidationErrors = (status: number) => status === 400;
const getFirstValidationError = (errors: { field: string, message: string[] }[]) => {
  if (errors.length === 0 || errors[0].message.length === 0) return undefined;
  return `${getSectionNameByField(errors[0].field)} validation error: ${errors[0].message[0]}`;
};

export const CreateProfileSteps = React.memo(() => {
  const queryClient = useQueryClient();
  const steps = ["Company Information", "My Information"];
  const { setCompanyId, setUserDetails } = useContext(OnRouteBCContext);
  const { setSnackBar } = useContext(SnackBarContext);

  const { user } = useAuth();

  const [activeStep, setActiveStep] = React.useState(0);
  const [clientNumber, setClientNumber] = React.useState(null);

  // Add a setter when there's a use for it.
  const [completed] = React.useState<{
    [k: number]: boolean;
  }>({});

  const formMethods = useForm<CompanyAndUserRequest>({
    defaultValues: {
      legalName: user?.profile?.bceid_business_name as string,
      mailingAddress: {
        addressLine1: "",
        addressLine2: "",
        provinceCode: "",
        countryCode: "",
        city: "",
        postalCode: "",
      },
      email: "",
      phone: "",
      extension: "",
      fax: "",
      adminUser: {
        userAuthGroup: "ORGADMIN",
        firstName: "",
        lastName: "",
        email: "",
        phone1: "",
        phone1Extension: "",
        phone2: "",
        phone2Extension: "",
        fax: "",
        countryCode: "",
        provinceCode: "",
        city: "",
      },
      primaryContact: {
        firstName: "",
        lastName: "",
        email: "",
        phone1: "",
        phone1Extension: "",
        phone2: "",
        phone2Extension: "",
        countryCode: "",
        provinceCode: "",
        city: "",
      },
    },
  });
  const { handleSubmit, register } = formMethods;

  const createProfileQuery = useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (isSubmissionSuccessful(response.status)) {
        const responseBody = await response.json();
        const companyId = responseBody["companyId"];
        const userDetails = {
          firstName: responseBody.adminUser?.firstName,
          lastName: responseBody.adminUser?.lastName,
          userName: responseBody.adminUser?.userName,
          phone1: responseBody.adminUser?.phone1,
          phone1Extension: responseBody.adminUser?.phone1Extension,
          phone2: responseBody.adminUser?.phone2,
          phone2Extension: responseBody.adminUser?.phone2Extension,
          email: responseBody.adminUser?.email,
          fax: responseBody.adminUser?.fax,
        };
        setUserDetails?.(() => userDetails);
        setCompanyId?.(() => companyId);
        
        // Setting the companyId in the sessionStorage so that it can be used
        // used outside of react components;
        sessionStorage.setItem('onRouteBC.user.companyId', companyId);


        setClientNumber(() => responseBody["clientNumber"]);
        queryClient.invalidateQueries(["userContext"]);
      } else if (hasValidationErrors(response.status)) {
        const { error } = await response.json();
        const firstErrMsg = getFirstValidationError(getDefaultRequiredVal([], error));
        if (firstErrMsg) {
          setSnackBar({
            message: firstErrMsg,
            showSnackbar: true,
            setShowSnackbar: () => true,
            alertType: "error",
          });
        }
      }
    },
  });

  /**
   * On Click function for the Finish button
   * Validates and submits the form data to the API
   * @param data The form data.
   */
  const onClickFinish = function (data: FieldValues) {
    const profileToBeCreated = data as CompanyAndUserRequest;
    createProfileQuery.mutate(profileToBeCreated);
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const totalSteps = () => {
    return steps.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (clientNumber) {
    return (
      <>
        <OnRouteBCProfileCreated onRouteBCClientNumber={clientNumber} />
      </>
    );
  }
  return (
    <>
      <FormProvider {...formMethods}>
        <input type="hidden" {...register("legalName")} />
        <input type="hidden" {...register("adminUser.userAuthGroup")} />
        <Box
          className="layout-box"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Banner
            bannerText="Create a new onRouteBC Profile"
            bannerSubtext="Please follow the steps below to set up your onRouteBC profile"
          />
          <br></br>
        </Box>
        <div
          className="tabpanel-container create-profile-steps"
          role="profile-steps"
          id={`profile-steps`}
          aria-labelledby={`profile-steps`}
        >
          <div className="create-profile-steps__create-profile">
            <div className="create-profile-section create-profile-section--steps">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step className="step" key={label}>
                    <StepLabel className="step__label">{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            <ExistingTPSSelection screenSize="sm" />
            <div className="create-profile-section create-profile-section--info">
              <Alert severity="info">
                <Typography>
                  <strong>
                    Please note, unless stated otherwise, all fields are
                    mandatory.
                  </strong>
                </Typography>
              </Alert>
            </div>
            {activeStep === 0 && (
              <div className="create-profile-section create-profile-section--company">
                <h2>Company Mailing Address</h2>
                <hr></hr>
                <CompanyBanner
                  legalName={user?.profile?.bceid_business_name as string}
                />
                <CompanyInformationWizardForm />
              </div>
            )}
            {activeStep === 1 && (
              <div className="create-profile-section create-profile-section--user">
                <h2>User Details</h2>
                <hr></hr>
                <UserInformationWizardForm />
              </div>
            )}
            <div className="create-profile-section create-profile-section--nav">
              {activeStep === 0 && (
                <Button
                  className="proceed-btn proceed-btn--next"
                  onClick={handleSubmit(handleNext)}
                  variant="contained"
                  color="primary"
                  endIcon={<>&rarr;</>}
                >
                  Next
                </Button>
              )}
              {activeStep === 1 && (
                <>
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    color="secondary"
                    startIcon={<>&larr;</>}
                    className="proceed-btn proceed-btn--prev"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit(onClickFinish)}
                    variant="contained"
                    className="proceed-btn proceed-btn--finish"
                  >
                    Finish
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="create-profile-steps__existing-tps">
            <ExistingTPSSelection screenSize="lg" />
          </div>
        </div>
      </FormProvider>
    </>
  );
});

CreateProfileSteps.displayName = "CreateProfileSteps";
