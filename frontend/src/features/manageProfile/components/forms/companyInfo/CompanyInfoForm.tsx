import { Button, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { FormProvider, useForm, FieldValues } from "react-hook-form";
import { updateCompanyInfo } from "../../../apiManager/manageProfileAPI";

import "./CompanyInfoForms.scss";
import { CompanyInfoGeneralForm } from "./subForms/CompanyInfoGeneralForm";
import { CompanyContactDetailsForm } from "./subForms/CompanyContactDetailsForm";
import { CompanyPrimaryContactForm } from "./subForms/CompanyPrimaryContactForm";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { InfoBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { CompanyProfile } from "../../../types/manageProfile";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";

/**
 * The Company Information Form contains multiple subs forms including
 * Company Info, Company Contact, Primary Contact, and Mailing Address Forms.
 * This Component contains the logic for React Hook forms and React query
 * for state management and API calls
 */
export const CompanyInfoForm = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const queryClient = useQueryClient();

    const formMethods = useForm<CompanyProfile>({
      defaultValues: {
        clientNumber: getDefaultRequiredVal("", companyInfo?.clientNumber),
        legalName: getDefaultRequiredVal("", companyInfo?.legalName),
        mailingAddress: {
          addressLine1: getDefaultRequiredVal("", companyInfo?.mailingAddress?.addressLine1),
          addressLine2: getDefaultRequiredVal("", companyInfo?.mailingAddress?.addressLine2),
          city: getDefaultRequiredVal("", companyInfo?.mailingAddress?.city),
          provinceCode: getDefaultRequiredVal("", companyInfo?.mailingAddress?.provinceCode),
          countryCode: getDefaultRequiredVal("", companyInfo?.mailingAddress?.countryCode),
          postalCode: getDefaultRequiredVal("", companyInfo?.mailingAddress?.postalCode),
        },
        email: getDefaultRequiredVal("", companyInfo?.email),
        phone: applyWhenNotNullable(formatPhoneNumber, companyInfo?.phone, ""),
        extension: getDefaultRequiredVal("", companyInfo?.extension),
        fax: applyWhenNotNullable(formatPhoneNumber, companyInfo?.fax, ""),
        primaryContact: {
          firstName: getDefaultRequiredVal("", companyInfo?.primaryContact?.firstName),
          lastName: getDefaultRequiredVal("", companyInfo?.primaryContact?.lastName),
          phone1: applyWhenNotNullable(formatPhoneNumber, companyInfo?.primaryContact?.phone1, ""),
          phone1Extension: getDefaultRequiredVal("", companyInfo?.primaryContact?.phone1Extension),
          phone2: applyWhenNotNullable(formatPhoneNumber, companyInfo?.primaryContact?.phone2, ""),
          phone2Extension: getDefaultRequiredVal("", companyInfo?.primaryContact?.phone2Extension),
          email: getDefaultRequiredVal("", companyInfo?.primaryContact?.email),
          city: getDefaultRequiredVal("", companyInfo?.primaryContact?.city),
          provinceCode: getDefaultRequiredVal("", companyInfo?.primaryContact?.provinceCode),
          countryCode: getDefaultRequiredVal("", companyInfo?.primaryContact?.countryCode),
        },
      },
    });

    const { handleSubmit } = formMethods;

    const addCompanyInfoQuery = useMutation({
      mutationFn: updateCompanyInfo,
      onSuccess: (response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries(["companyInfo"]);
          setIsEditting(false);
        } // else { // Display Error in the form }
      },
    });

    const onUpdateCompanyInfo = function (data: FieldValues) {
      const companyInfoToBeUpdated = data as CompanyProfile;
      addCompanyInfoQuery.mutate({
        companyInfo: companyInfoToBeUpdated,
      });
    };

    const FEATURE = "company-profile";

    return (
      <div className="company-info-form">
        <FormProvider {...formMethods}>
          <CompanyInfoGeneralForm feature={FEATURE} />

          <Typography variant="h2" gutterBottom>
            Company Contact Details
          </Typography>

          <CompanyContactDetailsForm feature={FEATURE} />

          <Typography variant="h2" gutterBottom>
            Company Primary Contact
          </Typography>

          <InfoBcGovBanner description="The Company Primary Contact will be contacted for all onRouteBC client profile queries." />

          <CompanyPrimaryContactForm feature={FEATURE} />
        </FormProvider>
        <div className="company-info-form__submission">
          <Button
            key="update-company-info-cancel-button"
            aria-label="Cancel Update"
            variant="contained"
            color="tertiary"
            onClick={() => setIsEditting(false)}
            className="submit-btn submit-btn--cancel"
          >
            Cancel
          </Button>
          <Button
            key="update-company-info-button"
            aria-label="Update Company Info"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onUpdateCompanyInfo)}
            className="submit-btn"
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
);

CompanyInfoForm.displayName = "CompanyInfoForm";
