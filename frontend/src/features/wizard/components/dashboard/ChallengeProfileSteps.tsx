import { Box, Button, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../../common/components/dashboard/Banner";
import "../../../../common/components/dashboard/Dashboard.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Nullable } from "../../../../common/types/common";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { verifyMigratedClient } from "../../../manageProfile/apiManager/manageProfileAPI";
import {
  VerifyMigratedClientRequest,
  VerifyMigratedClientResponse,
} from "../../../manageProfile/types/manageProfile";
import { ClientAndPermitReferenceInfoBox } from "../../subcomponents/ClientAndPermitReferenceInfoBox";
import { OnRouteBCProfileCreated } from "../../subcomponents/OnRouteBCProfileCreated";
import { VerifyMigratedClientForm } from "../../subcomponents/VerifyMigratedClientForm";
import { WizardCompanyBanner } from "../../subcomponents/WizardCompanyBanner";
import "./CreateProfileSteps.scss";
import { Reusable } from "./Reusable";
import { LoadBCeIDUserRolesByCompany } from "../../../../common/authentication/LoadBCeIDUserRolesByCompany";
/**
 * The stepper component containing the necessary forms for creating profile.
 */
export const ChallengeProfileSteps = React.memo(() => {
  const navigate = useNavigate();
  const steps = ["Verify Profile", "Company Information", "My Information"];
  const { setMigratedClient } = useContext(OnRouteBCContext);

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [isClientVerified, setIsClientVerified] = useState<boolean>(false);
  const [clientNumber, setClientNumber] = useState<Nullable<string>>(null);

  const verifyMigratedClientFormMethods = useForm<VerifyMigratedClientRequest>({
    defaultValues: {
      clientNumber: "",
      permitNumber: "",
    },
  });

  const {
    handleSubmit: handleVerifyClientSubmit,
    setError: setVerifyClientError,
    clearErrors: clearVerifyClientErrors,
  } = verifyMigratedClientFormMethods;

  const verifyMigratedClientMutation = useMutation({
    mutationFn: verifyMigratedClient,
    onSuccess: async (response: VerifyMigratedClientResponse) => {
      const { foundClient, foundPermit, migratedClient } = response;
      if (foundClient && foundPermit && migratedClient) {
        // Clear form errors (if any)
        clearVerifyClientErrors();

        setIsClientVerified(() => true);
        setActiveStep(() => 1);

        // set the updated migrated client in OnRouteBCContext.
        setMigratedClient?.(() => migratedClient);
      } else {
        if (!foundClient) {
          setVerifyClientError("clientNumber", {
            message: "Client No. not found",
          });
        }
        if (!foundPermit) {
          setVerifyClientError("permitNumber", {
            message: "Permit No. does not match Client No.",
          });
        }
        setIsClientVerified(() => true);
        setActiveStep(() => 1);
      }
    },
  });

  /**
   * Onclick handler for Next button at Verify Profile stage.
   * @param data The form data.
   */
  const handleNextVerifyClientStep = (data: VerifyMigratedClientRequest) => {
    verifyMigratedClientMutation.mutate(data);
  };

  if (clientNumber) {
    return (
      <>
        <LoadBCeIDUserRolesByCompany />
        <OnRouteBCProfileCreated onRouteBCClientNumber={clientNumber} />
      </>
    );
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
        id={`profile-steps`}
        aria-labelledby={`profile-steps`}
        style={{ paddingBottom: "10em" }}
      >
        <div
          className="create-profile-steps__create-profile"
          style={{ width: "50%" }}
        >
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
                <WizardCompanyBanner
                  legalName={getDefaultRequiredVal(
                    "",
                    user?.profile?.bceid_business_name as string,
                  )}
                />
                <VerifyMigratedClientForm />
                <div className="create-profile-section create-profile-section--nav">
                  {activeStep === 0 && (
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
                        onClick={handleVerifyClientSubmit(
                          handleNextVerifyClientStep,
                        )}
                        variant="contained"
                        color="primary"
                        endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                      >
                        Next
                      </Button>
                    </Stack>
                  )}
                </div>
              </div>
            </FormProvider>
          )}
          {activeStep !== 0 && isClientVerified && (
            <Reusable
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setClientNumber={setClientNumber}
            />
          )}
        </div>
        {activeStep === 0 && (
          <div
            style={{
              padding: "1.5em",
            }}
          >
            <ClientAndPermitReferenceInfoBox />
          </div>
        )}
      </div>
    </>
  );
});

ChallengeProfileSteps.displayName = "ChallengeProfileSteps";
