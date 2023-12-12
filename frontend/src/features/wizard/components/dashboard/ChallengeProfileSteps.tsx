import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { SnackBarContext } from "../../../../App";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../../common/components/dashboard/Banner";
import "../../../../common/components/dashboard/Dashboard.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import {
  createOnRouteBCProfile,
  verifyMigratedClient,
} from "../../../manageProfile/apiManager/manageProfileAPI";
import {
  CompanyAndUserRequest,
  VerifyMigratedClientRequest,
} from "../../../manageProfile/types/manageProfile";
import { CompanyInformationWizardForm } from "../../pages/CompanyInformationWizardForm";
import { OnRouteBCProfileCreated } from "../../pages/OnRouteBCProfileCreated";
import { UserInformationWizardForm } from "../../pages/UserInformationWizardForm";
import "./CreateProfileSteps.scss";
import { useNavigate } from "react-router";
import { VerifyMigratedClientForm } from "../../pages/VerifyMigratedClientForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

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

const isSubmissionSuccessful = (status: number) =>
  status === 201 || status === 200;
const hasValidationErrors = (status: number) => status === 400;
const getFirstValidationError = (
  errors: { field: string; message: string[] }[],
) => {
  if (errors.length === 0 || errors[0].message.length === 0) return undefined;
  return `${getSectionNameByField(errors[0].field)} validation error: ${
    errors[0].message[0]
  }`;
};

/**
 * The stepper component containing the necessary forms for creating profile.
 */
export const ChallengeProfileSteps = React.memo(() => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const steps = ["Verify Profile", "Company Information", "My Information"];
  const {
    setCompanyId,
    setUserDetails,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
    setMigratedClient,
    migratedClient,
  } = useContext(OnRouteBCContext);
  const { setSnackBar } = useContext(SnackBarContext);

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [isClientVerified, setIsClientVerified] = useState<boolean>(false);
  const [clientNumber, setClientNumber] = useState(null);

  // Add a setter when there's a use for it.
  const [completed] = useState<{
    [k: number]: boolean;
  }>({});

  const verifyMigratedClientFormMethods = useForm<VerifyMigratedClientRequest>({
    defaultValues: {
      clientNumber: "",
      permitNumber: "",
    },
  });

  const { handleSubmit: handleVerifyClientSubmit } =
    verifyMigratedClientFormMethods;

  const verifyMigratedClientMutation = useMutation({
    mutationFn: verifyMigratedClient,
    onSuccess: async (response) => {
      if (response?.clientAndPermitMatch) {
        setIsClientVerified(() => true);
      } else {
        console.log("coming here");
        setIsClientVerified(() => true);
      }
    },
  });

  const companyAndUserFormMethods = useForm<CompanyAndUserRequest>({
    defaultValues: {
      legalName: getDefaultRequiredVal(
        "",
        user?.profile?.bceid_business_name as string,
      ),
      alternateName: getDefaultRequiredVal("", migratedClient?.alternateName),
      mailingAddress: {
        addressLine1: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.addressLine1,
        ),
        addressLine2: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.addressLine2,
        ),
        provinceCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.provinceCode,
        ),
        countryCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.countryCode,
        ),
        city: getDefaultRequiredVal("", migratedClient?.mailingAddress?.city),
        postalCode: getDefaultRequiredVal(
          "",
          migratedClient?.mailingAddress?.postalCode,
        ),
      },
      email: getDefaultRequiredVal("", user?.profile?.email),
      phone: getDefaultRequiredVal("", migratedClient?.phone),
      extension: getDefaultRequiredVal("", migratedClient?.extension),
      fax: getDefaultRequiredVal("", migratedClient?.fax),
      adminUser: {
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
  const { handleSubmit: handleCreateProfileSubmit, register } =
    companyAndUserFormMethods;

  const createProfileQuery = useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (isSubmissionSuccessful(response.status)) {
        const responseBody = response.data;
        const companyId = responseBody["companyId"];
        const companyName = responseBody["legalName"];
        const clientNumber = responseBody["clientNumber"];
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
          userAuthGroup: responseBody.adminUser?.userAuthGroup,
        };
        setUserDetails?.(() => userDetails);
        setCompanyId?.(() => companyId);
        setCompanyLegalName?.(() => companyName);
        setOnRouteBCClientNumber?.(() => clientNumber);

        // Clear any state in migrated client. We no longer need this
        // once the user has successfully created/claimed their company.
        setMigratedClient?.(() => undefined);

        // Setting the companyId in the sessionStorage so that it can be used
        // used outside of react components;
        sessionStorage.setItem("onRouteBC.user.companyId", companyId);

        setClientNumber(() => responseBody["clientNumber"]);
        queryClient.invalidateQueries(["userContext"]);
      } else if (hasValidationErrors(response.status)) {
        const { error } = response.data;
        const firstErrMsg = getFirstValidationError(
          getDefaultRequiredVal([], error),
        );
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

  const handleNext = (
    data: VerifyMigratedClientRequest | CompanyAndUserRequest,
  ) => {
    if (activeStep === 0 && !isClientVerified) {
      verifyMigratedClientMutation.mutate(data as VerifyMigratedClientRequest);
    } else if (isClientVerified || activeStep > 0) {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (clientNumber) {
    return <OnRouteBCProfileCreated onRouteBCClientNumber={clientNumber} />;
  }
  return (
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner
          bannerText="Claim an existing Profile"
          bannerSubtext="Please follow the steps below to claim an existing profile"
        />
      </Box>

      <div
        className="tabpanel-container create-profile-steps"
        role="profile-steps"
        id={`profile-steps`}
        aria-labelledby={`profile-steps`}
      >
        {/* <Stack direction="row"> */}
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
          {activeStep === 0 && (
            <FormProvider {...verifyMigratedClientFormMethods}>
              <div className="create-profile-section create-profile-section--company">
                <CompanyBanner
                  legalName={getDefaultRequiredVal(
                    "",
                    user?.profile?.bceid_business_name as string,
                  )}
                />
                <VerifyMigratedClientForm />
                <div className="create-profile-section create-profile-section--nav">
                  {activeStep === 0 && (
                    <>
                      <Stack direction="row" spacing={3}>
                        <Button
                          key="cancel-create-profile-button"
                          aria-label="Cancel Create Profile"
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            // Go back
                            navigate(-1);
                          }}
                          disableElevation
                          sx={{
                            ":hover": {
                              background: BC_COLOURS.bc_background_light_grey,
                              border: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
                            },
                            border: `2px solid ${BC_COLOURS.white}`,
                            borderRadius: "4px",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="proceed-btn proceed-btn--next"
                          onClick={handleVerifyClientSubmit(handleNext)}
                          variant="contained"
                          color="primary"
                          endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                        >
                          Next
                        </Button>
                      </Stack>
                    </>
                  )}
                </div>
              </div>
            </FormProvider>
          )}

          {activeStep !== 0 && (
            <FormProvider {...companyAndUserFormMethods}>
              <input type="hidden" {...register("legalName")} />
              {activeStep !== 0 && (
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
              )}
              {activeStep === 1 && (
                <div className="create-profile-section create-profile-section--company">
                  <CompanyBanner
                    legalName={getDefaultRequiredVal(
                      "",
                      user?.profile?.bceid_business_name as string,
                    )}
                  />
                  <CompanyInformationWizardForm />
                </div>
              )}
              {activeStep === 2 && (
                <div className="create-profile-section create-profile-section--user">
                  <h2>User Details</h2>
                  <hr></hr>
                  <UserInformationWizardForm />
                </div>
              )}
              <div className="create-profile-section create-profile-section--nav">
                {activeStep === 1 && (
                  <>
                    <Stack direction="row" spacing={3}>
                      <Button
                        key="cancel-create-profile-button"
                        aria-label="Cancel Create Profile"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          // Go back
                          navigate(-1);
                        }}
                        disableElevation
                        sx={{
                          ":hover": {
                            background: BC_COLOURS.bc_background_light_grey,
                            border: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
                          },
                          border: `2px solid ${BC_COLOURS.white}`,
                          borderRadius: "4px",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBack}
                        variant="contained"
                        color="secondary"
                        startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                        className="proceed-btn proceed-btn--prev"
                        sx={{
                          ":hover": {
                            background: BC_COLOURS.bc_text_links_blue,
                            border: `2px solid ${BC_COLOURS.bc_text_links_blue}`,
                          },
                          border: `2px solid ${BC_COLOURS.bc_primary_blue}`,
                          borderRadius: "4px",
                          color: `${BC_COLOURS.bc_primary_blue}`,
                          background: `${BC_COLOURS.white}`,
                        }}
                      >
                        <strong>Previous</strong>
                      </Button>
                      <Button
                        className="proceed-btn proceed-btn--next"
                        onClick={handleCreateProfileSubmit(handleNext)}
                        variant="contained"
                        color="primary"
                        endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                      >
                        Next
                      </Button>
                    </Stack>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <Button
                      onClick={handleBack}
                      variant="contained"
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                      className="proceed-btn proceed-btn--prev"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleCreateProfileSubmit(onClickFinish)}
                      variant="contained"
                      className="proceed-btn proceed-btn--finish"
                    >
                      Finish
                    </Button>
                  </>
                )}
              </div>
            </FormProvider>
          )}
        </div>
        {/* </Stack> */}
        <Card
          title="XYZ XS"
          sx={{
            width: "528px",
            background: `${BC_COLOURS.bc_messages_blue_background}`,
          }}
        >
          {/* <CardHeader
            title={
              <strong>Where can I find my Client No. and Permit No.?</strong>
            }
            avatar={<FontAwesomeIcon icon={faCircleInfo} />}
          /> */}

          <CardContent>
            <Stack spacing={3}>
              <div>
                Your Client No. and Permit No. can be found on any <br />
                Commercial Vehicle Permit. Please see the sample below.
                <br />
                If you need further assistance, please contact the
                <br />
                Provincial Permit Centre at{" "}
                <strong>Toll-free: 1-800-559-9688</strong> or <br />{" "}
                <strong>Email: ppcpermit@gov.bc.ca</strong>
              </div>
              <Stack spacing={3}>
                <CardMedia component="img" src="/Old_Permit_Sample.png" />
                <CardMedia component="img" src="/New_Permit_Sample.png" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

ChallengeProfileSteps.displayName = "CreateProfileSteps";
