import { Box, Button, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { LoadBCeIDUserClaimsByCompany } from "../../../../common/authentication/LoadBCeIDUserClaimsByCompany";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Nullable } from "../../../../common/types/common";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { verifyMigratedClient } from "../../../manageProfile/apiManager/manageProfileAPI";
import {
  CreateCompanyRequest,
  VerifyClientRequest,
  VerifyMigratedClientResponse,
} from "../../../manageProfile/types/manageProfile";
import { ClientAndPermitReferenceInfoBox } from "../../subcomponents/ClientAndPermitReferenceInfoBox";
import { CompanyAndUserInfoSteps } from "../../subcomponents/CompanyAndUserInfoSteps";
import { OnRouteBCProfileCreated } from "../../subcomponents/OnRouteBCProfileCreated";
import { VerifyMigratedClientForm } from "../../subcomponents/VerifyMigratedClientForm";
import { WizardClientBanner } from "../../subcomponents/WizardClientBanner";
import "./CreateProfileSteps.scss";
import { AxiosError } from "axios";

/**
 * The stepper component containing the necessary forms for creating profile.
 */
export const ChallengeProfileSteps = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [clientNumber, setClientNumber] = useState<Nullable<string>>(null);

  const defaultCompanyAndUserInfoValues = {
    legalName: getDefaultRequiredVal(
      "",
      user?.profile?.bceid_business_name as string,
    ),
    email: getDefaultRequiredVal("", user?.profile?.email),
    adminUser: {
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
  };

  const verifyMigratedClientFormMethods = useForm<VerifyClientRequest>({
    defaultValues: {
      clientNumber: "",
      permitNumber: "",
    },
  });

  const companyAndUserFormMethods = useForm<CreateCompanyRequest>({
    defaultValues: defaultCompanyAndUserInfoValues,
  });

  const {
    handleSubmit: handleVerifyClientSubmit,
    setError: setVerifyClientError,
    clearErrors: clearVerifyClientErrors,
  } = verifyMigratedClientFormMethods;

  const { reset: resetCompanyAndUserForm } = companyAndUserFormMethods;

  const verifyMigratedClientMutation = useMutation({
    mutationFn: verifyMigratedClient,
    onSuccess: async (response: VerifyMigratedClientResponse) => {
      const { foundClient, foundPermit, verifiedClient } = response;
      if (foundClient && foundPermit && verifiedClient) {
        // Clear form errors (if any)
        clearVerifyClientErrors();
        setActiveStep(() => 1);

        resetCompanyAndUserForm({
          ...defaultCompanyAndUserInfoValues,
          migratedClientHash: getDefaultRequiredVal(
            "",
            verifiedClient?.migratedClientHash,
          ),
          alternateName: getDefaultRequiredVal(
            "",
            verifiedClient?.alternateName,
          ),
          mailingAddress: {
            addressLine1: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.addressLine1,
            ),
            addressLine2: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.addressLine2,
            ),
            provinceCode: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.provinceCode,
            ),
            countryCode: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.countryCode,
            ),
            city: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.city,
            ),
            postalCode: getDefaultRequiredVal(
              "",
              verifiedClient?.mailingAddress?.postalCode,
            ),
          },
          phone: getDefaultRequiredVal("", verifiedClient?.phone),
          extension: getDefaultRequiredVal("", verifiedClient?.extension),
          primaryContact: {
            firstName: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.firstName,
            ),
            lastName: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.lastName,
            ),
            email: getDefaultRequiredVal("", verifiedClient?.email),
            phone1: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.phone1,
              verifiedClient?.phone,
            ),
            phone1Extension: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.phone1Extension,
            ),
            phone2: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.phone2,
            ),
            phone2Extension: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.phone2Extension,
            ),
            provinceCode: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.provinceCode,
            ),
            countryCode: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.countryCode,
            ),
            city: getDefaultRequiredVal(
              "",
              verifiedClient?.primaryContact?.city,
            ),
          },
          clientNumber: getDefaultRequiredVal("", verifiedClient?.clientNumber),
        });
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
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) {
        // The new user is trying to claim a profile that is already claimed.
        // Redirect to the error page.
        navigate(ERROR_ROUTES.CLAIM_PROFILE_ERROR, {
          state: { correlationId: error.response?.headers["x-correlation-id"] },
        });
      }
      navigate(ERROR_ROUTES.UNEXPECTED, {
        state: { correlationId: error.response?.headers["x-correlation-id"] },
      });
    },
  });

  /**
   * Onclick handler for Next button at Verify Profile stage.
   * @param data The form data.
   */
  const handleNextVerifyClientStep = async (data: VerifyClientRequest) => {
    verifyMigratedClientMutation.mutate(data);
  };

  if (clientNumber) {
    return (
      <>
        <LoadBCeIDUserClaimsByCompany />
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
        <Banner bannerText="Claim an existing Profile" />
      </Box>

      <div
        className="challenge-profile-steps create-profile-steps"
        id={`profile-steps`}
        aria-labelledby={`profile-steps`}
        style={{ paddingBottom: "10em" }}
      >
        <div
          className="create-profile-steps__create-profile"
          style={{ width: "50%" }}
        >
          {activeStep === 0 && (
            <FormProvider {...verifyMigratedClientFormMethods}>
              <div className="create-profile-section create-profile-section--company">
                <WizardClientBanner
                  legalName={getDefaultRequiredVal(
                    "",
                    user?.profile?.bceid_business_name as string,
                  )}
                />
                <VerifyMigratedClientForm />
                <div className="create-profile-section create-profile-section--nav">
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
                </div>
              </div>
            </FormProvider>
          )}
          {activeStep === 1 && (
            <FormProvider {...companyAndUserFormMethods}>
              <CompanyAndUserInfoSteps setClientNumber={setClientNumber} />
            </FormProvider>
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
