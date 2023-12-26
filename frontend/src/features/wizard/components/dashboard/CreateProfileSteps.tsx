import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React, { useContext } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { Nullable } from "vitest";
import { LoadBCeIDUserRolesByCompany } from "../../../../common/authentication/LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../../common/components/dashboard/Banner";
import "../../../../common/components/dashboard/Dashboard.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { CompanyAndUserRequest } from "../../../manageProfile/types/manageProfile";
import { OnRouteBCProfileCreated } from "../../subcomponents/OnRouteBCProfileCreated";
import "./CreateProfileSteps.scss";
import { CompanyAndUserInfoSteps } from "../../subcomponents/CompanyAndUserInfoSteps";

/**
 * The stepper component containing the necessary forms for creating profile.
 */
export const CreateProfileSteps = React.memo(() => {
  const steps = ["Company Information", "My Information"];

  const { migratedClient } = useContext(OnRouteBCContext);
  const { user } = useAuth();

  const [activeStep, setActiveStep] = React.useState(0);
  const [clientNumber, setClientNumber] =
    React.useState<Nullable<string>>(null);

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
          bannerText="Create a new onRouteBC Profile"
          bannerSubtext="Please follow the steps below to set up your onRouteBC profile"
        />
      </Box>
      <div
        className="tabpanel-container create-profile-steps"
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
          <FormProvider {...companyAndUserFormMethods}>
            <CompanyAndUserInfoSteps
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setClientNumber={setClientNumber}
              totalSteps={2}
            />
          </FormProvider>
        </div>
      </div>
    </>
  );
});

CreateProfileSteps.displayName = "CreateProfileSteps";
