/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./IDIRCreateCompany.scss";
import { Nullable } from "../../../common/types/common";
import { Banner } from "../../../common/components/dashboard/components/banner/Banner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import { ERROR_ROUTES } from "../../../routes/constants";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { createOnRouteBCProfile } from "../../manageProfile/apiManager/manageProfileAPI";
import { ClientInformationWizardForm } from "../../wizard/subcomponents/ClientInformationWizardForm";
import { OnRouteBCProfileCreated } from "../../wizard/subcomponents/OnRouteBCProfileCreated";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import {
  CreateCompanyRequest,
  CompanyProfile,
} from "../../manageProfile/types/manageProfile";
import { AxiosError } from "axios";
import { WarningBcGovBanner } from "../../../common/components/banners/WarningBcGovBanner";
import { createProfileMutation } from "../hooks/hooks";

/**
 * The form for a staff user to create a company.
 */
export const IDIRCreateCompany = React.memo(() => {
  const navigate = useNavigate();

  const [clientNumber, setClientNumber] = useState<Nullable<string>>(null);
  const {
    migratedClient,
    setCompanyId,
    setOnRouteBCClientNumber,
    setCompanyLegalName,
  } = useContext(OnRouteBCContext);

  const companyAndUserFormMethods = useForm<CreateCompanyRequest>({
    defaultValues: {
      legalName: getDefaultRequiredVal("", migratedClient?.legalName),
      alternateName: getDefaultRequiredVal("", migratedClient?.alternateName),
      clientNumber: getDefaultRequiredVal("", migratedClient?.clientNumber),
      migratedClientHash: getDefaultRequiredVal(
        "",
        migratedClient?.migratedClientHash,
      ),
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
      email: getDefaultRequiredVal("", migratedClient?.email),
      phone: getDefaultRequiredVal("", migratedClient?.phone),
      extension: getDefaultRequiredVal("", migratedClient?.extension),
      // A migrated but unclaimed company will not have primaryContact.
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

  const { handleSubmit } = companyAndUserFormMethods;

  const { mutate: createProfile } = createProfileMutation(setClientNumber);

  /**
   * On Click function for the Finish button
   * Validates and submits the form data to the API
   * @param data The form data.
   */
  const onClickFinish = function (data: CreateCompanyRequest) {
    const updatedContact = {
      ...data.primaryContact,
      city: data.mailingAddress.city,
      countryCode: data.mailingAddress.countryCode,
      provinceCode: data.mailingAddress.provinceCode,
    };

    const profileToBeCreated = {
      ...data,
      email: data.primaryContact.email,
      phone: data.primaryContact.phone1,
      extension: data.primaryContact.phone1Extension,
      primaryContact: updatedContact,
      adminUser: updatedContact,
    };

    createProfile(profileToBeCreated);
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
        <Banner bannerText="Create a new onRouteBC Profile" />
      </Box>
      <div
        className="idir-create-company create-profile-steps"
        id={`profile-steps`}
        aria-labelledby={`profile-steps`}
      >
        <div className="create-profile-steps__create-profile">
          <FormProvider {...companyAndUserFormMethods}>
            <ClientInformationWizardForm showCompanyName />
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
                  onClick={handleSubmit(onClickFinish)}
                  variant="contained"
                  className="proceed-btn proceed-btn--finish"
                >
                  Finish
                </Button>
              </Stack>
            </div>
          </FormProvider>
        </div>
      </div>
    </>
  );
});

IDIRCreateCompany.displayName = "IDIRCreateCompany";
