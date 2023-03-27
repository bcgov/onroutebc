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

export const CreateProfileSteps = React.memo(() => {
  const steps = ["Company Information", "My Information"];

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

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

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

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
                            <Button variant="outlined" color="info">Claim it now</Button>
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
                <h2>User Details</h2>
                <hr></hr>
                <UserInformationForm></UserInformationForm>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={4} item></Grid>
              <Grid>
                <Button onClick={handleNext} variant="contained">
                  Next
                </Button>
              </Grid>
            </Grid>
          </div>
        </Box>
      </div>
    </>
  );
});

CreateProfileSteps.displayName = "ManageProfilesDashboard";
