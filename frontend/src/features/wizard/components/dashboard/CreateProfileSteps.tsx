import {
  Alert,
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";
import { Banner } from "../../../../common/components/dashboard/Banner";
import "../../../../common/components/dashboard/Dashboard.scss";
import { UserInformationForm } from "../pages/UserInformationForm";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import {
  CompanyAndUserRequest,
  createOnRouteBCProfile,
} from "../../../manageProfile/apiManager/manageProfileAPI";
import { UserInformationWizardForm } from "../pages/UserInformationWizardForm";
import { CompanyInformationWizardForm } from "../pages/CompanyInformationWizardForm";
import { useMutation } from "@tanstack/react-query";
import { OnRouteBCProfileCreated } from "../pages/OnRouteBCProfileCreated";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { useAuth } from "react-oidc-context";

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

export const CreateProfileSteps = React.memo(() => {
  const steps = ["Company Information", "My Information"];

  const { user } = useAuth();
  console.log(user?.profile?.bceid_business_name);

  const [activeStep, setActiveStep] = React.useState(0);
  const [clientNumber, setClientNumber] = React.useState(null);
  // const [clientNumber, setClientNumber] = React.useState("123443444");
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const formMethods = useForm<CompanyAndUserRequest>({
    defaultValues: {
      legalName:
        (user?.profile?.bceid_business_name as string) ||
        "Bandstra Transportation Systems Ltd.",
      adminUser: {
        userAuthGroup: "ORGADMIN",
      },
    },
  });
  const { handleSubmit, register } = formMethods;

  const createProfileQuery = useMutation({
    mutationFn: createOnRouteBCProfile,
    onSuccess: async (response) => {
      if (response.status === 201 || response.status === 200) {
        const responseBody = await response.json();
        setClientNumber(() => responseBody["clientNumber"]);
      } else {
        // Display Error
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
    console.log(profileToBeCreated);
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
          className="tabpanel-container"
          role="profile-steps"
          id={`profile-steps`}
          aria-labelledby={`profile-steps`}
        >
          <Box sx={{ width: "100%" }}>
            <br></br>
            <div>
              <Grid container>
                <Grid xs={6} item>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
                <Grid xs={2} item></Grid>
                <Grid xs={3} item>
                  <Grid container>
                    <Grid xs={12} item>
                      <hr />
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={3} item>
                          <img
                            height="64"
                            width="64"
                            src="./Existing_Account_Graphic.svg"
                          ></img>
                        </Grid>
                        <Grid xs={9} item>
                          <Grid container>
                            <Grid item>
                              <strong>Already have a TPS profile?</strong>
                            </Grid>
                            <br />
                            <Grid item>
                              <Button variant="outlined" color="info">
                                Claim it now
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <hr />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br></br>
              <Grid container>
                <Grid xs={7} item>
                  <Alert severity="info">
                    <Typography>
                      <strong>
                        Please note, unless stated otherwise, all fields are
                        mandatory.
                      </strong>
                    </Typography>
                  </Alert>
                  {activeStep === 0 && (
                    <div>
                      <h2>Company Mailing Address</h2>
                      <hr></hr>
                      <CompanyBanner legalName="Bandstra Transportation Systems Ltd." />
                      {/* <CompanyBanner
                        legalName={user?.profile?.bceid_business_name as string}
                      /> */}
                      <CompanyInformationWizardForm />
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div>
                      <h2>User Details</h2>
                      <hr></hr>
                      {/* <UserInformationForm></UserInformationForm> */}
                      <UserInformationWizardForm />
                    </div>
                  )}
                </Grid>
              </Grid>
              <br></br>
              {activeStep === 0 && (
                <Grid container>
                  <Grid xs={2} item>
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      color="primary"
                      endIcon={<>&rarr;</>}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container>
                  <Grid xs={2} item>
                    <Button
                      onClick={handleBack}
                      variant="contained"
                      color="secondary"
                      startIcon={<>&larr;</>}
                    >
                      Previous
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={handleSubmit(onClickFinish)}
                      variant="contained"
                    >
                      Finish
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          </Box>
          <br></br>
        </div>
      </FormProvider>
    </>
  );
});

CreateProfileSteps.displayName = "CreateProfileSteps";
