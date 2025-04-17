import { Button, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

import { Nullable } from "../../../common/types/common";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CreateCompanyRequest } from "../../manageProfile/types/manageProfile";
import { CompanyInformationWizardForm } from "./CompanyInformationWizardForm";
import { WizardClientBanner } from "./WizardClientBanner";
import { useCreateProfileMutation } from "../hooks/hooks";

/**
 * The company info and user info steps to be shared between
 * challenge and no challenge workflows.
 */
export const CompanyAndUserInfoSteps = ({
  setClientNumber,
}: {
  setClientNumber: Dispatch<SetStateAction<Nullable<string>>>;
}) => {
  const navigate = useNavigate();
  const { handleSubmit: handleCreateProfileSubmit, register } =
    useFormContext<CreateCompanyRequest>();

  const { user } = useAuth();
  const isBusinessBCeID = Boolean(user?.profile?.bceid_business_name);

  const { mutate: createProfile } = useCreateProfileMutation(setClientNumber);

  /**
   * On Click function for the Finish button
   * Validates and submits the form data to the API
   * @param data The form data.
   */
  const onClickFinish = (data: CreateCompanyRequest) => {
    const updatedContact = {
      ...data.primaryContact,
      city: data.mailingAddress.city,
      countryCode: data.mailingAddress.countryCode,
      provinceCode: data.mailingAddress.provinceCode,
      email: data.email,
    };

    const profileToBeCreated = {
      ...data,
      phone: data.primaryContact.phone1,
      extension: data.primaryContact.phone1Extension,
      primaryContact: updatedContact,
      adminUser: updatedContact,
    };

    createProfile(profileToBeCreated);
  };

  return (
    <>
      <div className="create-profile-section create-profile-section--company">
        {isBusinessBCeID && (
          <>
            <input type="hidden" {...register("legalName")} />
            <WizardClientBanner
              legalName={getDefaultRequiredVal(
                "",
                user?.profile?.bceid_business_name as string,
              )}
            />
          </>
        )}
        <CompanyInformationWizardForm showCompanyName={!isBusinessBCeID} />
      </div>
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
            onClick={handleCreateProfileSubmit(onClickFinish)}
            variant="contained"
            className="proceed-btn proceed-btn--finish"
          >
            Finish
          </Button>
        </Stack>
      </div>
    </>
  );
};
