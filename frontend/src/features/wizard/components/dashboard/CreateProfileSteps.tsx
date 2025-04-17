import { Box } from "@mui/material";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import "./CreateProfileSteps.scss";
import { Nullable } from "../../../../common/types/common";
import { LoadBCeIDUserClaimsByCompany } from "../../../../common/authentication/LoadBCeIDUserClaimsByCompany";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { CreateCompanyRequest } from "../../../manageProfile/types/manageProfile";
import { OnRouteBCProfileCreated } from "../../subcomponents/OnRouteBCProfileCreated";
import { CompanyAndUserInfoSteps } from "../../subcomponents/CompanyAndUserInfoSteps";

/**
 * The stepper component containing the necessary forms for creating profile.
 */
export const CreateProfileSteps = React.memo(() => {
  const { unclaimedClient } = useContext(OnRouteBCContext);
  const { user } = useAuth();
  const [clientNumber, setClientNumber] =
    React.useState<Nullable<string>>(null);

  const companyAndUserFormMethods = useForm<CreateCompanyRequest>({
    defaultValues: {
      legalName: getDefaultRequiredVal(
        "",
        user?.profile?.bceid_business_name as string,
        unclaimedClient?.legalName as string,
        user?.profile?.given_name as string,
      ),
      alternateName: getDefaultRequiredVal("", unclaimedClient?.alternateName),
      mailingAddress: {
        addressLine1: getDefaultRequiredVal(
          "",
          unclaimedClient?.mailingAddress?.addressLine1,
        ),
        addressLine2: getDefaultRequiredVal(
          null,
          unclaimedClient?.mailingAddress?.addressLine2,
        ),
        provinceCode: getDefaultRequiredVal(
          "",
          unclaimedClient?.mailingAddress?.provinceCode,
        ),
        countryCode: getDefaultRequiredVal(
          "",
          unclaimedClient?.mailingAddress?.countryCode,
        ),
        city: getDefaultRequiredVal("", unclaimedClient?.mailingAddress?.city),
        postalCode: getDefaultRequiredVal(
          "",
          unclaimedClient?.mailingAddress?.postalCode,
        ),
      },
      email: getDefaultRequiredVal("", user?.profile?.email),
      phone: getDefaultRequiredVal("", unclaimedClient?.phone),
      extension: getDefaultRequiredVal("", unclaimedClient?.extension),
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
      primaryContact: {
        firstName: getDefaultRequiredVal(
          "",
          unclaimedClient?.primaryContact?.firstName,
        ),
        lastName: getDefaultRequiredVal(
          "",
          unclaimedClient?.primaryContact?.lastName,
        ),
        email: "",
        phone1: getDefaultRequiredVal("", unclaimedClient?.phone),
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
        <Banner bannerText="Create a new onRouteBC Profile" />
      </Box>
      <div
        className="create-profile-steps-page create-profile-steps"
        id={`profile-steps`}
        aria-labelledby={`profile-steps`}
      >
        <div className="create-profile-steps__create-profile">
          <FormProvider {...companyAndUserFormMethods}>
            <CompanyAndUserInfoSteps setClientNumber={setClientNumber} />
          </FormProvider>
        </div>
      </div>
    </>
  );
});

CreateProfileSteps.displayName = "CreateProfileSteps";
